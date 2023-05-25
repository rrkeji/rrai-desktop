

export interface StableDiffusionText2ImageArgs {
    prompts: string,
    negative_prompt: string,
    steps: number,
    batch_size: number,
}

export const StableDiffusionText2ImageArgsDefault: StableDiffusionText2ImageArgs = {
    "prompts": "a dog",
    "negative_prompt": "nsfw, blurry, bad anatomy, ugly, disfigured, deformed, extra limbs, mutation, out of frame, poorly drawn face, poorly drawn hands, low quality, worst quality, watermark, extra legs, extra arms, mutated hands, jpeg artifacts, nude, naked, topless, nipple, bottomless,",
    "steps": 20,
    "batch_size": 2,
}