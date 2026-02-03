"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Navbar } from "@/components/navbar"
import { jobsData } from "@/lib/data"

export default function JobsPage() {
  const [appliedJobs, setAppliedJobs] = useState<number[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedType, setSelectedType] = useState<"all" | "internship" | "fulltime">("all")

  const handleApplyJob = (jobId: number) => {
    if (appliedJobs.includes(jobId)) {
      setAppliedJobs(appliedJobs.filter((id) => id !== jobId))
    } else {
      setAppliedJobs([...appliedJobs, jobId])
    }
  }

  const filteredJobs = jobsData.filter((job) => {
    const matchesSearch =
      job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.company.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesType =
      selectedType === "all" ||
      (selectedType === "internship" && job.type === "Internship") ||
      (selectedType === "fulltime" && job.type === "Full-time")
    return matchesSearch && matchesType
  })

  return (
    <div className="min-h-screen bg-background">
      <Navbar userType="user" currentPage="jobs" />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-4">Internships & Job Opportunities</h1>
          <p className="text-muted-foreground mb-6">Explore career opportunities posted by our alumni</p>

          {/* Filters */}
          <div className="space-y-4">
            <div className="flex flex-col md:flex-row gap-4">
              <input
                type="text"
                placeholder="Search jobs by title or company..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="flex-1 px-4 py-2 rounded-lg border border-border bg-card text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <Button>Search</Button>
            </div>

            <div className="flex gap-2 flex-wrap">
              {(["all", "internship", "fulltime"] as const).map((type) => (
                <button
                  key={type}
                  onClick={() => setSelectedType(type)}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors text-sm ${
                    selectedType === type
                      ? "bg-primary text-primary-foreground"
                      : "bg-card border border-border text-foreground hover:border-primary"
                  }`}
                >
                  {type === "all" ? "All Opportunities" : type === "internship" ? "Internships" : "Full-time Jobs"}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Jobs Grid */}
        <div className="grid md:grid-cols-2 gap-6">
          {filteredJobs.map((job) => (
            <div
              key={job.id}
              className="bg-card border border-border rounded-lg p-6 hover:border-accent hover:shadow-lg transition-all flex flex-col"
            >
              <div className="mb-4">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xs font-bold px-2 py-1 bg-primary/10 text-primary rounded">{job.type}</span>
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-2">{job.title}</h3>
                <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                  <span className="font-medium text-accent">{job.company}</span>
                </div>
                <div className="text-sm text-primary font-semibold">{job.salary}</div>
              </div>

              <p className="text-muted-foreground mb-4 text-sm">{job.description}</p>

              <div className="space-y-3 mb-6 text-sm flex-1">
                <div className="flex items-start gap-2">
                  <span>📍</span>
                  <span className="text-muted-foreground">{job.location}</span>
                </div>
                <div>
                  <div className="text-xs font-semibold text-muted-foreground mb-1">ELIGIBILITY</div>
                  <p className="text-foreground">{job.eligibility}</p>
                </div>
                <div>
                  <div className="text-xs font-semibold text-muted-foreground mb-1">POSTED BY</div>
                  <p className="text-foreground">{job.postedBy}</p>
                </div>
              </div>

              <Button
                onClick={() => handleApplyJob(job.id)}
                variant={appliedJobs.includes(job.id) ? "default" : "outline"}
                className="w-full"
              >
                {appliedJobs.includes(job.id) ? "✓ Applied" : "Apply Now"}
              </Button>
            </div>
          ))}
        </div>

        {filteredJobs.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No opportunities found matching your criteria</p>
          </div>
        )}
      </main>
    </div>
  )
}
