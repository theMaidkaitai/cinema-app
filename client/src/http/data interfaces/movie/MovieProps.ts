export interface MovieProps {
    id?: number,
    title?: string,
    description?: string,
    video_name?: string,
    cover_name?: string,
    genre?: string,
    duration?: number,
    rating?: number,
    path_cover_fileName?: string | undefined
    onClick?: () => void
}