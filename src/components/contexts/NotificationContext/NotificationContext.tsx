'use client'
import React, { createContext, useContext, useState, type ReactNode } from "react"
import { type NotificationType } from "./Notification/types";
import Notification from "./Notification/Notification";

type NotificationsContextType = {
    notification: NotificationType;
    showNotification: (newVal: NotificationType) => void;
    hideNotification: () => void;
}

const NotificationsContext = createContext<NotificationsContextType | null>(null);

export const useNotification = () => {
    const context = useContext(NotificationsContext);
    if (!context) {
        throw new Error('useNotification must be used within a NotificationsProvider');
    }
    return context;
};

export const NotificationProvider = ({ children }: { children: ReactNode }) => {

    const [notification, setNotification] = useState<NotificationType>({
        show: false,
    })

    /**
     * ### Show Notification
     * Set new settings for the notification and it show immediately:
     * - `purpose?`: 'alert' | 'notification' (by default: "alert")
     * - `type?`: 'error' | 'info' | 'completed' | 'warning' (by default: "info")
     * - `title?`: string
     * - `message?`: string | React.ReactNode | null
     * - `customIcon?`: React.ReactNode
     * - `duration?`: number
     * - `buttons?`: Button[]
     * 
     * #### Example of usage
     * ```
     * showNotification({
     *      purpose: "notification",
     *      type: "error",
     *      title: "Error occured",
     *      duration: 6000
     * })
     * ```
     * @param newVals 
     */
    const showNotification = (newVals: NotificationType) => {
        setNotification(prev => ({
            ...prev,
            ...newVals,
            show: true
        }))
    }

    /**
     * ### Hide Notification
     * What it do is to set `show` to false
     */
    const hideNotification = () => {
        setNotification(prev => ({
            ...prev,
            show: false
        }))
    }
    
    return (
        <NotificationsContext.Provider value={{ notification, showNotification, hideNotification }}>
            {children}
            <Notification 
                show={notification.show} 
                content={{ 
                    title: notification.title,
                    message: notification.message,
                    customIcon: notification.customIcon,
                    duration: notification.duration,
                    buttons: notification.buttons
                }} 
                purpose={notification.purpose ?? "notification"}
                type={notification.type ?? "info"}
                onClose={hideNotification}
            />
        </NotificationsContext.Provider>
    )
}