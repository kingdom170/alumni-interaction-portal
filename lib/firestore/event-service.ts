import { db } from "@/lib/firebase"
import {
    collection,
    addDoc,
    doc,
    getDoc,
    getDocs,
    query,
    where,
    orderBy,
    serverTimestamp,
    Timestamp,
} from "firebase/firestore"

export interface EventData {
    eventId?: string
    title: string
    description: string
    date: string
    time: string
    category: string
    mode?: string
    meetLink?: string
    venue?: string
    posterURL?: string
    createdBy: string
    createdByName: string
    createdByRole: string
    maxAttendees?: number
    attendeeCount?: number
    status: string
    tags?: string[]
    createdAt?: any
    updatedAt?: any
}

export interface RegistrationData {
    userId?: string
    userName: string
    userEmail: string
    userPhone: string
    department: string
    year: string
    dietaryRestrictions?: string
    additionalNotes?: string
    registeredAt?: any
    attended?: boolean
}

/**
 * Create a new event in Firestore
 */
export async function createEvent(eventData: EventData): Promise<string> {
    try {
        const eventsRef = collection(db, "events")
        const docRef = await addDoc(eventsRef, {
            ...eventData,
            attendeeCount: 0,
            status: "upcoming",
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp(),
        })
        return docRef.id
    } catch (error) {
        console.error("Error creating event:", error)
        throw new Error("Failed to create event")
    }
}

/**
 * Get all events created by a specific organizer
 */
export async function getEventsByOrganizer(organizerId: string): Promise<EventData[]> {
    try {
        const eventsRef = collection(db, "events")
        const q = query(eventsRef, where("createdBy", "==", organizerId), orderBy("createdAt", "desc"))

        const snapshot = await getDocs(q)
        return snapshot.docs.map((doc) => ({
            eventId: doc.id,
            ...doc.data(),
        })) as EventData[]
    } catch (error) {
        console.error("Error fetching events:", error)
        return []
    }
}

/**
 * Get all events (for students)
 */
export async function getAllEvents(): Promise<EventData[]> {
    try {
        const eventsRef = collection(db, "events")
        const q = query(eventsRef, orderBy("createdAt", "desc"))

        const snapshot = await getDocs(q)
        return snapshot.docs.map((doc) => ({
            eventId: doc.id,
            ...doc.data(),
        })) as EventData[]
    } catch (error) {
        console.error("Error fetching events:", error)
        return []
    }
}

/**
 * Register a student for an event
 */
export async function registerForEvent(
    eventId: string,
    registrationData: RegistrationData,
): Promise<boolean> {
    try {
        // Create registration document
        const registrationsRef = collection(db, "events", eventId, "registrations")
        await addDoc(registrationsRef, {
            ...registrationData,
            registeredAt: serverTimestamp(),
            attended: false,
        })

        return true
    } catch (error) {
        console.error("Error registering for event:", error)
        throw new Error("Failed to register for event")
    }
}

/**
 * Get all registrations for a specific event
 */
export async function getEventRegistrations(eventId: string): Promise<RegistrationData[]> {
    try {
        const registrationsRef = collection(db, "events", eventId, "registrations")
        const q = query(registrationsRef, orderBy("registeredAt", "desc"))

        const snapshot = await getDocs(q)
        return snapshot.docs.map((doc) => ({
            userId: doc.id,
            ...doc.data(),
        })) as RegistrationData[]
    } catch (error) {
        console.error("Error fetching registrations:", error)
        return []
    }
}

/**
 * Check if a user is registered for an event
 */
export async function isUserRegistered(eventId: string, userEmail: string): Promise<boolean> {
    try {
        const registrationsRef = collection(db, "events", eventId, "registrations")
        const q = query(registrationsRef, where("userEmail", "==", userEmail))

        const snapshot = await getDocs(q)
        return !snapshot.empty
    } catch (error) {
        console.error("Error checking registration:", error)
        return false
    }
}

/**
 * Get event by ID
 */
export async function getEventById(eventId: string): Promise<EventData | null> {
    try {
        const eventRef = doc(db, "events", eventId)
        const eventDoc = await getDoc(eventRef)

        if (eventDoc.exists()) {
            return {
                eventId: eventDoc.id,
                ...eventDoc.data(),
            } as EventData
        }
        return null
    } catch (error) {
        console.error("Error fetching event:", error)
        return null
    }
}
