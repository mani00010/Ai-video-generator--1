# API Integration Guide - VidForge AI

Complete guide for integrating free and open-source APIs for real video generation.

## 🎯 Overview

VidForge AI can work with multiple API providers. This guide covers setup for each.

---

## 1️⃣ Hugging Face (Recommended - Free Forever)

**Best for:** General use, completely free, no credit card required

### Sign Up
1. Go to https://huggingface.co/
2. Click "Sign Up" (free forever)
3. Verify your email

### Get API Token
1. Go to https://huggingface.co/settings/tokens
2. Click "New token"
3. Name it: "VidForge AI"
4. Role: "Read"
5. Copy the token (starts with `hf_`)

### Integration

**Option A: Direct in HTML**
```javascript
// In index.html, find the generateImages function (around line 450)
// Replace the fetch call with:

const response = await fetch('https://api-inference.huggingface.co/models/stabilityai/stable-diffusion-2-1', {
    method: 'POST',
    headers: {
        'Authorization': 'Bearer hf_YOUR_TOKEN_HERE',
        'Content-Type': 'application/json',
    },
    body: JSON.stringify({
        inputs: enhancedPrompt,
        options: { wait_for_model: true }
    })
});
```

**Option B: Using config.js**
```javascript
// In config.js
HUGGINGFACE_API_KEY: 'hf_YOUR_TOKEN_HERE',
```

### Available Models

**Image Generation:**
- `stabilityai/stable-diffusion-2-1` (Default, best quality)
- `runwayml/stable-diffusion-v1-5` (Faster)
- `stabilityai/stable-diffusion-xl-base-1.0` (Highest quality, slower)

**Text Generation:**
- `mistralai/Mistral-7B-Instruct-v0.2` (Default)
- `meta-llama/Llama-2-7b-chat-hf` (Alternative)
- `google/flan-t5-xxl` (Faster)

### Rate Limits
- **Free tier:** ~100 requests/hour per model
- **Pro ($9/month):** 3000 requests/hour
- **Enterprise:** Unlimited

---

## 2️⃣ Replicate (Alternative - Pay-as-you-go)

**Best for:** High-quality outputs, $5 free credits on signup

### Sign Up
1. Go to https://replicate.com/
2. Sign up (email or GitHub)
3. Get $5 free credits

### Get API Token
1. Go to https://replicate.com/account/api-tokens
2. Copy your token

### Integration

```javascript
// Video generation with Replicate
async function generateWithReplicate(prompt) {
    const response = await fetch('https://api.replicate.com/v1/predictions', {
        method: 'POST',
        headers: {
            'Authorization': 'Token YOUR_REPLICATE_TOKEN',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            version: "stability-ai/sdxl",
            input: {
                prompt: prompt,
                num_outputs: 1
            }
        })
    });
    
    const prediction = await response.json();
    
    // Poll for completion
    while (prediction.status !== 'succeeded') {
        await new Promise(r => setTimeout(r, 1000));
        const check = await fetch(
            `https://api.replicate.com/v1/predictions/${prediction.id}`,
            { headers: { 'Authorization': 'Token YOUR_REPLICATE_TOKEN' } }
        );
        prediction = await check.json();
    }
    
    return prediction.output;
}
```

### Models to Use

**Image Generation:**
- `stability-ai/sdxl` - Best quality ($0.00025/image)
- `stability-ai/stable-diffusion` - Standard ($0.00012/image)

**Video Generation:**
- `anotherjesse/zeroscope-v2-xl` - Text to video ($0.014/generation)
- `cjwbw/damo-text-to-video` - Alternative ($0.006/generation)

### Cost Estimate
- Images: ~$0.00025 each
- 30-second video (15 frames): ~$0.004
- 100 videos: ~$0.40

---

## 3️⃣ Stability AI (Professional - $10 free credits)

**Best for:** Highest quality, production use

### Sign Up
1. Go to https://platform.stability.ai/
2. Sign up
3. Get $10 free credits

### Get API Key
1. Dashboard > Account
2. Copy API key

### Integration

```javascript
async function generateWithStability(prompt) {
    const response = await fetch(
        'https://api.stability.ai/v1/generation/stable-diffusion-xl-1024-v1-0/text-to-image',
        {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer YOUR_STABILITY_KEY',
            },
            body: JSON.stringify({
                text_prompts: [{ text: prompt }],
                cfg_scale: 7,
                height: 1024,
                width: 1024,
                samples: 1,
                steps: 30,
            }),
        }
    );

    const data = await response.json();
    return data.artifacts[0].base64;
}
```

### Pricing
- SDXL: $0.02 per image
- SD 1.6: $0.002 per image
- Very high quality but more expensive

---

## 4️⃣ Together AI (Fast - Free tier available)

**Best for:** Speed, multiple models

### Sign Up
1. Go to https://www.together.ai/
2. Sign up with GitHub
3. $25 free credits

### Get API Key
1. Settings > API Keys
2. Create new key

### Integration

```javascript
async function generateWithTogether(prompt) {
    const response = await fetch('https://api.together.xyz/inference', {
        method: 'POST',
        headers: {
            'Authorization': 'Bearer YOUR_TOGETHER_KEY',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            model: 'stabilityai/stable-diffusion-xl-base-1.0',
            prompt: prompt,
            steps: 30,
            n: 1
        })
    });
    
    return await response.json();
}
```

---

## 5️⃣ Local AI (100% Free - Self-hosted)

**Best for:** Privacy, unlimited usage, no costs

### Option A: Stable Diffusion Web UI

```bash
# Install (Windows/Mac/Linux)
git clone https://github.com/AUTOMATIC1111/stable-diffusion-webui.git
cd stable-diffusion-webui
./webui.sh  # On Linux/Mac
webui-user.bat  # On Windows

# Access at: http://localhost:7860
```

**Integration:**
```javascript
async function generateLocalSD(prompt) {
    const response = await fetch('http://localhost:7860/sdapi/v1/txt2img', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            prompt: prompt,
            steps: 30,
            width: 1024,
            height: 1024
        })
    });
    
    const data = await response.json();
    return `data:image/png;base64,${data.images[0]}`;
}
```

### Option B: Ollama (Text Generation)

```bash
# Install Ollama
curl https://ollama.ai/install.sh | sh

# Pull model
ollama pull mistral

# Run
ollama serve
```

**Integration:**
```javascript
async function generateLocalText(prompt) {
    const response = await fetch('http://localhost:11434/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            model: 'mistral',
            prompt: prompt,
            stream: false
        })
    });
    
    const data = await response.json();
    return data.response;
}
```

---

## 6️⃣ Alternative Free Services

### Lexica AI
- https://lexica.art/
- Search and generate AI images
- Free tier available

### Craiyon (formerly DALL-E mini)
- https://www.craiyon.com/
- Completely free
- API available

### DeepAI
- https://deepai.org/
- Free tier: 5 API calls/month
- $5/month: 500 calls

---

## 🔄 Multi-Provider Fallback System

Implement smart fallback to ensure video generation always works:

```javascript
const providers = [
    { name: 'huggingface', func: generateWithHuggingFace, priority: 1 },
    { name: 'replicate', func: generateWithReplicate, priority: 2 },
    { name: 'local', func: generateLocalSD, priority: 3 },
    { name: 'fallback', func: generateFallbackFrame, priority: 4 }
];

async function generateImageSmart(prompt) {
    for (const provider of providers) {
        try {
            console.log(`Trying ${provider.name}...`);
            const result = await provider.func(prompt);
            console.log(`✓ Success with ${provider.name}`);
            return result;
        } catch (error) {
            console.log(`✗ Failed with ${provider.name}:`, error.message);
            continue;
        }
    }
    
    // This should never be reached due to fallback
    throw new Error('All providers failed');
}
```

---

## 🎨 Prompt Engineering Tips

### For Best Results

**Stable Diffusion Prompts:**
```javascript
const promptTemplates = {
    cinematic: (base) => `${base}, cinematic lighting, film grain, shallow depth of field, 8k, ultra detailed, professional photography`,
    anime: (base) => `${base}, anime style, studio ghibli, makoto shinkai, detailed, vibrant colors, high quality`,
    realistic: (base) => `${base}, photorealistic, 8k uhd, dslr, high quality, film grain, sharp focus`,
    artistic: (base) => `${base}, oil painting, masterpiece, trending on artstation, detailed brushwork`
};
```

**Negative Prompts:**
```javascript
const negativePrompts = {
    quality: 'blurry, low quality, pixelated, distorted, ugly, deformed',
    artifacts: 'watermark, text, signature, username, logo',
    style: 'cartoon, anime, 3d render' // Adjust based on desired style
};
```

---

## 📊 API Comparison Table

| Provider | Free Tier | Quality | Speed | Best For |
|----------|-----------|---------|-------|----------|
| Hugging Face | 100/hr | Good | Medium | General use |
| Replicate | $5 credits | Excellent | Fast | Quality |
| Stability AI | $10 credits | Best | Fast | Production |
| Together AI | $25 credits | Good | Very Fast | Speed |
| Local | Unlimited | Good | Varies | Privacy |
| Fallback | Unlimited | Basic | Instant | Always works |

---

## 🐛 Troubleshooting

### "API key invalid"
- Check for spaces before/after key
- Verify key hasn't expired
- Generate new key

### "Rate limit exceeded"
- Wait 60 minutes
- Use alternative provider
- Upgrade plan

### "Model loading timeout"
- First request may take 20s (model cold start)
- Subsequent requests faster
- Use `wait_for_model: true` option

### "CORS error"
- Cannot be fixed client-side
- Use providers that support CORS
- Or create simple proxy server

---

## 🔐 Security Best Practices

### Never Expose API Keys

**Bad:**
```javascript
const API_KEY = 'sk-1234567890'; // Visible in source code!
```

**Good:**
```javascript
// Use environment variables
const API_KEY = process.env.HUGGINGFACE_KEY;

// Or prompt user to enter their own key
const API_KEY = localStorage.getItem('api_key');
```

### Key Management

```javascript
// Let users enter their own keys
function setupAPIKey() {
    const key = prompt('Enter your Hugging Face API key (optional):');
    if (key) {
        localStorage.setItem('hf_key', key);
        showToast('API key saved securely', 'success');
    }
}

// Retrieve securely
function getAPIKey() {
    return localStorage.getItem('hf_key') || null;
}
```

---

## 🎯 Recommended Setup

For immediate use:
1. **Start with Hugging Face** (free, no credit card)
2. **Add local fallback** (always works)
3. **Later add Replicate** (for better quality when needed)

This gives you:
- ✅ Free unlimited generation
- ✅ Always works (fallback)
- ✅ Optional high quality
- ✅ No credit card required

---

## 📚 Additional Resources

- Hugging Face Docs: https://huggingface.co/docs
- Replicate Docs: https://replicate.com/docs
- Stability AI Docs: https://platform.stability.ai/docs
- Together AI Docs: https://docs.together.ai/

---

## 💡 Pro Tips

1. **Cache results** - Save generated images to avoid regenerating
2. **Batch requests** - Generate multiple frames in parallel
3. **Use webhooks** - For long-running generations (Replicate)
4. **Monitor usage** - Track API costs in real-time
5. **A/B test prompts** - Find what works best for each style

---

Ready to generate real AI videos! 🎬
