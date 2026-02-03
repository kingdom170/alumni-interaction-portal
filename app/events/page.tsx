"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Navbar } from "@/components/navbar"
import { eventsData } from "@/lib/data"
import { RatingModal } from "@/components/rating-modal"

export default function EventsPage() {
  const [registeredEvents, setRegisteredEvents] = useState<number[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [ratingModal, setRatingModal] = useState<{
    isOpen: boolean
    eventId: number | null
    eventTitle: string
  }>({ isOpen: false, eventId: null, eventTitle: "" })
  const [ratings, setRatings] = useState<Record<number, { rating: number; comment: string }>>({})

  const handleRegisterEvent = (eventId: number) => {
    if (registeredEvents.includes(eventId)) {
      setRegisteredEvents(registeredEvents.filter((id) => id !== eventId))
    } else {
      setRegisteredEvents([...registeredEvents, eventId])
    }
  }

  const handleRatingSubmit = (rating: number, comment: string) => {
    if (ratingModal.eventId !== null) {
      setRatings({
        ...ratings,
        [ratingModal.eventId]: { rating, comment },
      })
      setRatingModal({ isOpen: false, eventId: null, eventTitle: "" })
      alert("Thank you for your feedback!")
    }
  }

  const filteredEvents = eventsData.filter(
    (event) =>
      event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.category.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  return (
    <div className="min-h-screen bg-background">
      <Navbar userType="user" currentPage="events" />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-4">Networking Events</h1>
          <p className="text-muted-foreground mb-6">Explore and attend exclusive events hosted by our alumni network</p>

          {/* Search */}
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Search events by title or category..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-1 px-4 py-2 rounded-lg border border-border bg-card text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <Button>Search</Button>
          </div>
        </div>

        {/* Events Grid */}
        <div className="grid md:grid-cols-2 gap-6">
          {filteredEvents.map((event) => (
            <div
              key={event.id}
              className="bg-card border border-border rounded-lg p-6 hover:border-primary hover:shadow-lg transition-all"
            >
              <div className="mb-4">
                <div className="text-sm font-medium text-primary mb-2">{event.category}</div>
                <h3 className="text-xl font-semibold text-foreground">{event.title}</h3>
              </div>

              <p className="text-muted-foreground mb-4">{event.description}</p>

              <div className="space-y-3 mb-6 text-sm">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <span>📅</span>
                  <span>{event.date}</span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <span>🕐</span>
                  <span>{event.time}</span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <span>👤</span>
                  <span>{event.organizer}</span>
                </div>
              </div>

              {ratings[event.id] && (
                <div className="bg-muted/50 p-2 rounded mb-3 text-xs">
                  <div className="flex gap-1 mb-1">
                    {[...Array(5)].map((_, i) => (
                      <span key={i}>{i < ratings[event.id].rating ? "⭐" : "☆"}</span>
                    ))}
                  </div>
                  Your rating
                </div>
              )}

              <div className="flex gap-2">
                <Button
                  onClick={() => handleRegisterEvent(event.id)}
                  className={registeredEvents.includes(event.id) ? "flex-1 bg-green-600 hover:bg-green-700" : "flex-1"}
                >
                  {registeredEvents.includes(event.id) ? "✓ Registered" : "Register"}
                </Button>

                <button
                  onClick={() => setRatingModal({ isOpen: true, eventId: event.id, eventTitle: event.title })}
                  className="px-4 py-2 rounded-lg border border-border text-foreground hover:bg-muted transition-colors font-medium text-sm"
                >
                  {ratings[event.id] ? "Update" : "Rate"}
                </button>
              </div>
            </div>
          ))}
        </div>

        {filteredEvents.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No events found matching your search</p>
          </div>
        )}

        <RatingModal
          isOpen={ratingModal.isOpen}
          itemName={ratingModal.eventTitle}
          itemType="event"
          onClose={() => setRatingModal({ isOpen: false, eventId: null, eventTitle: "" })}
          onSubmit={handleRatingSubmit}
        />
      </main>
    </div>
  )
}
