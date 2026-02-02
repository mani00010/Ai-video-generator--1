# VidForge AI - Professional Video Generation Platform

## 🎬 Features

- **AI-Powered Video Generation**: Create 30-60 second videos using advanced AI
- **Multiple Styles**: Cinematic, Anime, Realistic, Cartoon, 3D, Watercolor
- **AI Script Writer**: Automatic script generation based on topics
- **Background Music**: Multiple music styles to choose from
- **Voice Over Support**: Male and female voice options
- **Free & Unlimited**: No usage limits, completely free
- **Instant Download**: Download videos in high quality
- **Gallery System**: Save and manage all your generated videos

## 🚀 Quick Start

### Option 1: Direct Use (Simplest)
1. Open `index.html` in any modern web browser
2. The platform works immediately with fallback rendering
3. No installation required!

### Option 2: With API Keys (Enhanced Quality)
For better quality AI-generated images, configure these free APIs:

#### Hugging Face API (Free)
1. Sign up at https://huggingface.co/
2. Go to Settings > Access Tokens
3. Create a new token
4. Add to the code (line 450):
```javascript
headers: {
    'Authorization': 'Bearer YOUR_HUGGING_FACE_TOKEN'
}
```

#### Alternative APIs You Can Use

**Stability AI** (Free tier available)
- https://platform.stability.ai/
- Replace the Hugging Face API endpoint

**Replicate** (Pay-as-you-go, free credits)
- https://replicate.com/
- Models: stable-diffusion, text-to-video

**Together AI** (Free tier)
- https://www.together.ai/
- Similar to Hugging Face

## 📋 How It Works

### 1. Video Generation Pipeline
```
User Prompt → AI Image Generation → Frame Interpolation → 
Video Encoding → Audio Mixing → Final Video
```

### 2. Technical Stack
- **Frontend**: HTML5, CSS3, Vanilla JavaScript
- **Video Processing**: Canvas API, MediaRecorder API
- **Image Generation**: Hugging Face Stable Diffusion
- **Script Generation**: Mistral-7B via Hugging Face
- **Audio**: Web Audio API
- **Storage**: LocalStorage + Blob URLs

### 3. Features Breakdown

#### AI Script Generator
- Uses Mistral-7B-Instruct model
- Generates creative video scripts
- Falls back to template-based generation if API unavailable

#### Image Generation
- Stable Diffusion 2.1 via Hugging Face
- Style-specific prompts
- Fallback to gradient-based frames

#### Video Creation
- Canvas-based rendering at 30 FPS
- Smooth frame transitions
- WebM format with VP9 codec
- 1280x720 resolution

#### Audio Processing
- Background music generation (planned)
- Voice-over synthesis (planned)
- Audio mixing capabilities (planned)

## 🎨 Customization

### Modify Styles
Edit the `stylePrompts` object (line 410):
```javascript
const stylePrompts = {
    yourStyle: 'your custom prompt modifiers',
    // ... add more styles
};
```

### Change Video Resolution
Modify canvas dimensions (line 475):
```javascript
canvas.width = 1920;  // Change from 1280
canvas.height = 1080; // Change from 720
```

### Adjust Frame Rate
Change FPS in stream capture (line 483):
```javascript
const stream = canvas.captureStream(60); // Change from 30
```

## 🔧 Advanced Configuration

### Using Local AI Models

If you want to run everything locally:

1. **Install Ollama** (for script generation)
```bash
curl https://ollama.ai/install.sh | sh
ollama pull mistral
```

2. **Update Script Generation Function**
```javascript
async function generateScript() {
    const response = await fetch('http://localhost:11434/api/generate', {
        method: 'POST',
        body: JSON.stringify({
            model: 'mistral',
            prompt: `Write a video script about: ${topic}`
        })
    });
}
```

3. **Use Local Stable Diffusion** (Optional)
- Install automatic1111 or ComfyUI
- Point API calls to localhost:7860

## 🌐 Hosting

### GitHub Pages
1. Create a new repository
2. Upload `index.html`
3. Enable GitHub Pages in settings
4. Your site will be live!

### Netlify
1. Drag and drop the HTML file
2. Instant deployment
3. Free SSL included

### Vercel
```bash
npm i -g vercel
vercel --prod
```

## 📱 Browser Compatibility

- ✅ Chrome 90+
- ✅ Firefox 88+
- ✅ Safari 14+
- ✅ Edge 90+
- ⚠️ Mobile browsers (limited MediaRecorder support)

## 🐛 Troubleshooting

### "Video generation failed"
- Check browser console for errors
- Ensure stable internet connection
- Try reducing video duration
- Use fallback mode (it auto-activates)

### "Script generation failed"
- The system automatically uses fallback templates
- Check Hugging Face API status
- Verify API token if configured

### Videos won't download
- Check browser download permissions
- Try a different browser
- Use "Save As" instead of direct download

## 🎯 Roadmap

- [ ] Real voice synthesis integration
- [ ] Background music library
- [ ] Video effects and filters
- [ ] Batch video generation
- [ ] Cloud storage integration
- [ ] Social media sharing
- [ ] Video editing capabilities
- [ ] Custom watermarks

## 🤝 Contributing

This is an open-source project! Feel free to:
- Report bugs
- Suggest features
- Submit pull requests
- Share your generated videos

## 📄 License

MIT License - Free for personal and commercial use

## 🙏 Credits

- Stable Diffusion by Stability AI
- Hugging Face for model hosting
- Mistral AI for language models
- Web APIs by W3C

## 💡 Tips for Best Results

1. **Detailed Prompts**: More descriptive prompts = better results
2. **Style Matching**: Match prompt content with selected style
3. **Duration**: Start with 30 seconds for faster generation
4. **Script Generator**: Use it for creative inspiration
5. **Experimentation**: Try different combinations of styles and settings

## 🌟 Example Prompts

- "A futuristic city at night with flying cars and neon lights"
- "Peaceful mountain landscape with flowing rivers and wildlife"
- "Abstract geometric shapes morphing and dancing with colors"
- "Ocean waves crashing against rocky cliffs during golden hour"
- "Space station orbiting Earth with astronauts working outside"

## 📞 Support

For issues or questions:
- Check the troubleshooting section
- Review browser console errors
- Test with fallback mode enabled

---

Made with ❤️ using Open Source AI • Free Forever • No Limits
