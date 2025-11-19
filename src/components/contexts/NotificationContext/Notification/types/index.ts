
/**
 * Type for Button
 * @param onClick - The click event handler for the button
 * @param text - The text to display on the button
 * @param type - The type of the button (e.g., "submit", "button", "reset")
 */
export type Button = {
    // onClick: Function,
    onClick: React.MouseEventHandler<HTMLButtonElement>
    text: string
    type: string
}

export const NOTIFICATIONS_TYPES = ['error', 'info', 'completed', 'warning'] as const;
export type NotificationsTypes = typeof NOTIFICATIONS_TYPES[number];

export const NOTIFICATIONS_PURPOSES = ['alert', 'notification'] as const;
export type NotificationPurpose = typeof NOTIFICATIONS_PURPOSES[number];

export type NotificationType = {
    show?: boolean;
    purpose?: NotificationPurpose;
    type?: NotificationsTypes;
    title?: string;
    message?: string | React.ReactNode | null;
    customIcon?: React.ReactNode;
    duration?: number;
    buttons?: Button[]
}

export type NotificationContent = {
    title?: string, 
    message?: string | React.ReactNode, 
    reactNode?: React.ReactNode | null, 
    customIcon?: React.ReactNode | null, 
    duration?: number
    buttons?: Button[]
}