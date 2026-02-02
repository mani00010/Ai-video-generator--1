// VidForge AI - Configuration File
// Save this as config.js and include it in your HTML if you want to use API keys

const CONFIG = {
    // Hugging Face API (Free tier available)
    // Sign up at: https://huggingface.co/settings/tokens
    HUGGINGFACE_API_KEY: '', // Leave empty for fallback mode
    
    // Replicate API (Optional - for higher quality)
    // Sign up at: https://replicate.com/account/api-tokens
    REPLICATE_API_KEY: '',
    
    // Stability AI (Optional - for best quality)
    // Sign up at: https://platform.stability.ai/account/keys
    STABILITY_API_KEY: '',
    
    // ElevenLabs (Optional - for voice synthesis)
    // Sign up at: https://elevenlabs.io/
    ELEVENLABS_API_KEY: '',
    
    // API Endpoints
    ENDPOINTS: {
        huggingface_sd: 'https://api-inference.huggingface.co/models/stabilityai/stable-diffusion-2-1',
        huggingface_text: 'https://api-inference.huggingface.co/models/mistralai/Mistral-7B-Instruct-v0.2',
        replicate: 'https://api.replicate.com/v1/predictions',
        stability: 'https://api.stability.ai/v1/generation/stable-diffusion-xl-1024-v1-0/text-to-image',
    },
    
    // Video Settings
    VIDEO: {
        width: 1280,
        height: 720,
        fps: 30,
        bitrate: 5000000,
        format: 'webm',
        codec: 'vp9'
    },
    
    // Generation Settings
    GENERATION: {
        maxRetries: 3,
        retryDelay: 2000,
        timeoutMs: 30000,
        fallbackEnabled: true
    }
};

// API Helper Functions
const API = {
    // Hugging Face Image Generation
    async generateImage(prompt, style) {
        if (!CONFIG.HUGGINGFACE_API_KEY) {
            throw new Error('API key not configured - using fallback');
        }
        
        const response = await fetch(CONFIG.ENDPOINTS.huggingface_sd, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${CONFIG.HUGGINGFACE_API_KEY}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                inputs: prompt,
                options: { wait_for_model: true }
            })
        });
        
        if (!response.ok) throw new Error('Image generation failed');
        return await response.blob();
    },
    
    // Text Generation for Scripts
    async generateText(prompt) {
        if (!CONFIG.HUGGINGFACE_API_KEY) {
            throw new Error('API key not configured - using fallback');
        }
        
        const response = await fetch(CONFIG.ENDPOINTS.huggingface_text, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${CONFIG.HUGGINGFACE_API_KEY}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                inputs: prompt,
                parameters: {
                    max_new_tokens: 250,
                    temperature: 0.8,
                    top_p: 0.95,
                    return_full_text: false
                }
            })
        });
        
        if (!response.ok) throw new Error('Text generation failed');
        const data = await response.json();
        return data[0]?.generated_text || '';
    },
    
    // Replicate Video Generation (Alternative)
    async generateVideoReplicate(prompt) {
        if (!CONFIG.REPLICATE_API_KEY) {
            throw new Error('Replicate API key not configured');
        }
        
        const response = await fetch(CONFIG.ENDPOINTS.replicate, {
            method: 'POST',
            headers: {
                'Authorization': `Token ${CONFIG.REPLICATE_API_KEY}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                version: 'stability-ai/stable-video-diffusion',
                input: {
                    prompt: prompt,
                    num_frames: 30,
                    fps: 10
                }
            })
        });
        
        const prediction = await response.json();
        return prediction;
    },
    
    // Check API availability
    async checkAPIs() {
        const status = {
            huggingface: false,
            replicate: false,
            stability: false,
        };
        
        // Check Hugging Face
        try {
            const response = await fetch(CONFIG.ENDPOINTS.huggingface_sd, {
                method: 'GET',
                headers: CONFIG.HUGGINGFACE_API_KEY ? {
                    'Authorization': `Bearer ${CONFIG.HUGGINGFACE_API_KEY}`
                } : {}
            });
            status.huggingface = response.status !== 401;
        } catch (e) {
            console.log('Hugging Face check failed:', e);
        }
        
        return status;
    }
};

// Advanced Video Processing
const VideoProcessor = {
    // Add motion blur effect
    addMotionBlur(ctx, canvas, amount = 0.3) {
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const data = imageData.data;
        
        for (let i = 0; i < data.length; i += 4) {
            data[i] = data[i] * (1 - amount);
            data[i + 1] = data[i + 1] * (1 - amount);
            data[i + 2] = data[i + 2] * (1 - amount);
        }
        
        ctx.putImageData(imageData, 0, 0);
    },
    
    // Add film grain
    addFilmGrain(ctx, canvas, intensity = 0.1) {
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const data = imageData.data;
        
        for (let i = 0; i < data.length; i += 4) {
            const noise = (Math.random() - 0.5) * intensity * 255;
            data[i] += noise;
            data[i + 1] += noise;
            data[i + 2] += noise;
        }
        
        ctx.putImageData(imageData, 0, 0);
    },
    
    // Add vignette effect
    addVignette(ctx, canvas, intensity = 0.5) {
        const gradient = ctx.createRadialGradient(
            canvas.width / 2, canvas.height / 2, 0,
            canvas.width / 2, canvas.height / 2, Math.max(canvas.width, canvas.height) / 2
        );
        
        gradient.addColorStop(0, 'rgba(0, 0, 0, 0)');
        gradient.addColorStop(1, `rgba(0, 0, 0, ${intensity})`);
        
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
    },
    
    // Apply color grading
    applyColorGrading(ctx, canvas, preset = 'warm') {
        const presets = {
            warm: { r: 1.1, g: 1.0, b: 0.9 },
            cool: { r: 0.9, g: 1.0, b: 1.1 },
            vintage: { r: 1.2, g: 1.0, b: 0.8 },
            cyberpunk: { r: 1.0, g: 0.9, b: 1.3 }
        };
        
        const colors = presets[preset] || presets.warm;
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const data = imageData.data;
        
        for (let i = 0; i < data.length; i += 4) {
            data[i] = Math.min(255, data[i] * colors.r);
            data[i + 1] = Math.min(255, data[i + 1] * colors.g);
            data[i + 2] = Math.min(255, data[i + 2] * colors.b);
        }
        
        ctx.putImageData(imageData, 0, 0);
    }
};

// Audio Generation
const AudioGenerator = {
    // Generate simple background music
    async generateMusic(type, duration) {
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const buffer = audioContext.createBuffer(2, audioContext.sampleRate * duration, audioContext.sampleRate);
        
        const musicPatterns = {
            ambient: { frequencies: [220, 330, 440], tempo: 0.5 },
            upbeat: { frequencies: [262, 330, 392, 523], tempo: 2 },
            cinematic: { frequencies: [130, 196, 262, 330], tempo: 0.75 }
        };
        
        const pattern = musicPatterns[type] || musicPatterns.ambient;
        
        for (let channel = 0; channel < 2; channel++) {
            const data = buffer.getChannelData(channel);
            const { frequencies, tempo } = pattern;
            
            for (let i = 0; i < data.length; i++) {
                let sample = 0;
                const time = i / audioContext.sampleRate;
                
                frequencies.forEach((freq, index) => {
                    const envelope = Math.sin(time * tempo * Math.PI) * 0.3;
                    sample += Math.sin(2 * Math.PI * freq * time) * envelope * (1 / frequencies.length);
                });
                
                data[i] = sample * 0.2; // Reduce volume
            }
        }
        
        return buffer;
    },
    
    // Text-to-Speech (Simple Web Speech API)
    async generateVoiceover(text, voice = 'default') {
        return new Promise((resolve, reject) => {
            if (!('speechSynthesis' in window)) {
                reject(new Error('Speech synthesis not supported'));
                return;
            }
            
            const utterance = new SpeechSynthesisUtterance(text);
            const voices = speechSynthesis.getVoices();
            
            if (voice === 'female') {
                utterance.voice = voices.find(v => v.name.includes('Female')) || voices[0];
            } else if (voice === 'male') {
                utterance.voice = voices.find(v => v.name.includes('Male')) || voices[0];
            }
            
            utterance.rate = 0.9;
            utterance.pitch = 1.0;
            
            utterance.onend = () => resolve(true);
            utterance.onerror = reject;
            
            speechSynthesis.speak(utterance);
        });
    }
};

// Utility Functions
const Utils = {
    // Download blob as file
    downloadBlob(blob, filename) {
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    },
    
    // Format file size
    formatFileSize(bytes) {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
    },
    
    // Format duration
    formatDuration(seconds) {
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    },
    
    // Debounce function
    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }
};

// Export for use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { CONFIG, API, VideoProcessor, AudioGenerator, Utils };
}
