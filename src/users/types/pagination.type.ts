export interface PaginationType {
    limit?: number;
    offset?: number;
    qubi?: QubiElement
}

interface QubiElement {
    amount?: number;
    duration?: number;
}