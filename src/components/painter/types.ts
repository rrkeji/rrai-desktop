

export interface StableDiffusionText2ImageArgs {
    prompt: string,
    negative_prompt: string,
    enable_hr: boolean,
    denoising_strength: number,
    seed: number,
    n_iter: number,
    steps: number,
    batch_size: number,
    cfg_scale: number,
    width: number,
    height: number,
    restore_faces: boolean,
    tiling: boolean,
    override_settings: {
        sd_model_checkpoint: string
    },
    script_args: Array<any>
    sampler_index: string
}

export const StableDiffusionText2ImageArgsDefault: StableDiffusionText2ImageArgs = {
    prompt: "",
    negative_prompt: "nsfw, blurry, bad anatomy, ugly, disfigured, deformed, extra limbs, mutation, out of frame, poorly drawn face, poorly drawn hands, low quality, worst quality, watermark, extra legs, extra arms, mutated hands, jpeg artifacts, nude, naked, topless, nipple, bottomless,",
    enable_hr: false,
    denoising_strength: 0,
    seed: -1,
    n_iter: 1,
    steps: 20,
    batch_size: 2,
    cfg_scale: 7,
    width: 512,
    height: 512,
    restore_faces: false,
    tiling: false,
    override_settings: {
        sd_model_checkpoint: ''
    },
    script_args: [],
    sampler_index: 'DPM++ 2S a Karras'
}