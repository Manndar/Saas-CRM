declare enum TicketPriority {
    LOW = "LOW",
    MEDIUM = "MEDIUM",
    HIGH = "HIGH",
    URGENT = "URGENT"
}
export declare class CreateTicketDto {
    title: string;
    description?: string;
    priority?: TicketPriority;
}
export {};
