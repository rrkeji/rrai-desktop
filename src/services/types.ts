

export interface PromptImageEntity {
    width: number;
    height: number;
    prompt: string;
    model: string;
    src: string;
    srcSmall: string;
    gallery: string;
    nsfw: boolean;
    id: string;
}

export interface MetaEntity {
    currentPage: number;
    nextPage: string;
    pageSize: number;
    totalItems: number;
    totalPages: number;
}

export interface ResponseEntity {
    meta: MetaEntity,
    items: Array<PromptImageEntity>
}