

export interface LocalTaskEntity {
    id: number;
    category: string;
    task_type: string;
    request_task_id: string;
    name: string;
    ability: string;
    args: string;

    result_code: number;
    result: string;
    cover_image: string;
    stdout: string;
    stderr: string;
    progress: number;

    is_shared: number;
    shared_message_id: string;

    status: number;

    created: number;
    updated: number | null;
}
