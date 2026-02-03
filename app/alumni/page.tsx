"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Navbar } from "@/components/navbar"
import { alumniData } from "@/lib/data"
import { RatingModal } from "@/components/rating-modal"
import Link from "next/link"

export default function AlumniPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedField, setSelectedField] = useState<string>("all")
  const [ratingModal, setRatingModal] = useState<{
    isOpen: boolean
    alumniId: number | null
    alumniName: string
  }>({ isOpen: false, alumniId: null, alumniName: "" })
  const [ratings, setRatings] = useState<Record<number, { rating: number; comment: string }>>({})

  const uniqueFields = ["all", ...new Set(alumniData.map((a) => a.field))]

  const filteredAlumni = alumniData.filter((alumni) => {
    const matchesSearch =
      alumni.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      alumni.profession.toLowerCase().includes(searchTerm.toLowerCase()) ||
      alumni.company.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesField = selectedField === "all" || alumni.field === selectedField
    return matchesSearch && matchesField
  })

  const handleRatingSubmit = (rating: number, comment: string) => {
    if (ratingModal.alumniId !== null) {
      setRatings({
        ...ratings,
        [ratingModal.alumniId]: { rating, comment },
      })
      setRatingModal({ isOpen: false, alumniId: null, alumniName: "" })
      alert("Thank you for your feedback!")
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar userType="user" currentPage="alumni" />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-4">Alumni Directory</h1>
          <p className="text-muted-foreground mb-6">Connect with and learn from our successful alumni network</p>

          {/* Filters */}
          <div className="space-y-4">
            <input
              type="text"
              placeholder="Search by name, profession, or company..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 rounded-lg border border-border bg-card text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            />

            <div className="flex gap-2 flex-wrap">
              {uniqueFields.map((field) => (
                <button
                  key={field}
                  onClick={() => setSelectedField(field)}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors text-sm ${
                    selectedField === field
                      ? "bg-primary text-primary-foreground"
                      : "bg-card border border-border text-foreground hover:border-primary"
                  }`}
                >
                  {field === "all" ? "All Fields" : field}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Alumni Grid */}
        <div className="grid md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredAlumni.map((alumni) => (
            <div
              key={alumni.id}
              className="bg-card border border-border rounded-lg p-6 hover:border-primary hover:shadow-lg transition-all flex flex-col text-center"
            >
              <div className="text-5xl mb-4">{alumni.image}</div>

              <h3 className="font-semibold text-foreground mb-1 text-balance">{alumni.name}</h3>
              <p className="text-sm font-medium text-primary mb-2">{alumni.profession}</p>

              <div className="space-y-2 mb-6 text-xs text-muted-foreground flex-1">
                <div className="font-medium">{alumni.company}</div>
                <div>{alumni.field}</div>
                <div>{alumni.course}</div>
                <div>Batch {alumni.batch}</div>
              </div>

              {ratings[alumni.id] && (
                <div className="mb-3 text-sm">
                  <div className="flex justify-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <span key={i}>{i < ratings[alumni.id].rating ? "⭐" : "☆"}</span>
                    ))}
                  </div>
                </div>
              )}

              <div className="space-y-2">
                <Link href={`/chat/${alumni.id}`} className="block">
                  <Button className="w-full" size="sm">
                    Chat
                  </Button>
                </Link>
                <button
                  onClick={() => setRatingModal({ isOpen: true, alumniId: alumni.id, alumniName: alumni.name })}
                  className="w-full px-3 py-2 text-sm font-medium rounded-lg border border-border text-foreground hover:bg-muted transition-colors"
                >
                  {ratings[alumni.id] ? "Update Rating" : "Rate Mentor"}
                </button>
                <a href={`mailto:${alumni.email}`} className="block">
                  <Button variant="outline" className="w-full bg-transparent" size="sm">
                    Email
                  </Button>
                </a>
              </div>
            </div>
          ))}
        </div>

        {filteredAlumni.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No alumni found matching your search</p>
          </div>
        )}

        <RatingModal
          isOpen={ratingModal.isOpen}
          itemName={ratingModal.alumniName}
          itemType="alumni"
          onClose={() => setRatingModal({ isOpen: false, alumniId: null, alumniName: "" })}
          onSubmit={handleRatingSubmit}
        />
      </main>
    </div>
  )
}
