

export interface StableDiffusionText2ImageArgs {
    prompts: string,
    negative_prompt: string,
    steps: number,
    batch_size: number,
}

export const StableDiffusionText2ImageArgsDefault: StableDiffusionText2ImageArgs = {
    "prompts": "a dog",
    "negative_prompt": "lowres,",
    "steps": 20,
    "batch_size": 2,
}