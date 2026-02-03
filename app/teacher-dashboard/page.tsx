"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Navbar } from "@/components/navbar"
import { eventsData, alumniData, eventQueryMessages, coursesData } from "@/lib/data"
import Link from "next/link"
import type { Course } from "@/lib/data"

export default function TeacherDashboard() {
  const [activeTab, setActiveTab] = useState<
    "overview" | "post-event" | "post-course" | "queries" | "alumni" | "reviews"
  >("overview")
  const [eventTitle, setEventTitle] = useState("")
  const [eventDescription, setEventDescription] = useState("")
  const [eventDate, setEventDate] = useState("")
  const [eventTime, setEventTime] = useState("")
  const [eventCategory, setEventCategory] = useState("Workshop")
  const [postedEvents, setPostedEvents] = useState(eventsData)
  const [showForm, setShowForm] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedField, setSelectedField] = useState<string>("all")
  const [queries, setQueries] = useState<typeof eventQueryMessages>(eventQueryMessages)
  const [replyText, setReplyText] = useState<{ [key: string]: string }>({})
  const [expandedQuery, setExpandedQuery] = useState<string | null>(null)
  const [courseTitle, setCourseTitle] = useState("")
  const [courseDescription, setCourseDescription] = useState("")
  const [courseCategory, setCourseCategory] = useState("Web Development")
  const [courseLevel, setCourseLevel] = useState("Beginner")
  const [courseDuration, setCourseDuration] = useState("")
  const [courseStartDate, setCourseStartDate] = useState("")
  const [postedCourses, setPostedCourses] = useState<Course[]>(coursesData)
  const [showCourseForm, setShowCourseForm] = useState(false)

  const receivedReviews = [
    {
      id: "1",
      studentName: "Aditya Kumar",
      courseTitle: "Web Development Fundamentals",
      rating: 5,
      comment: "Excellent course! The instructor explained concepts very clearly.",
      date: "2025-01-08",
    },
    {
      id: "2",
      studentName: "Priya Nair",
      courseTitle: "Web Development Fundamentals",
      rating: 4,
      comment: "Great content and assignments. Would appreciate more real-world projects.",
      date: "2025-01-05",
    },
    {
      id: "3",
      studentName: "Rohit Gupta",
      eventTitle: "Career in AI & Machine Learning",
      rating: 5,
      comment: "Fantastic tech talk! Very inspiring and informative.",
      date: "2024-12-20",
    },
  ]

  const handlePostEvent = (e: React.FormEvent) => {
    e.preventDefault()
    if (!eventTitle || !eventDescription || !eventDate || !eventTime) {
      alert("Please fill in all fields")
      return
    }

    const newEvent = {
      id: postedEvents.length + 1,
      title: eventTitle,
      description: eventDescription,
      date: eventDate,
      time: eventTime,
      organizer: "Prof. Your Name",
      category: eventCategory,
    }

    setPostedEvents([...postedEvents, newEvent])
    setEventTitle("")
    setEventDescription("")
    setEventDate("")
    setEventTime("")
    setEventCategory("Workshop")
    setShowForm(false)
    alert("Event posted successfully!")
  }

  const handleDeleteEvent = (eventId: number) => {
    setPostedEvents(postedEvents.filter((event) => event.id !== eventId))
    alert("Event deleted successfully!")
  }

  const handleReplyQuery = (queryId: string) => {
    if (!replyText[queryId]?.trim()) return

    setQueries(queries.map((q) => (q.id === queryId ? { ...q, replied: true } : q)))
    setReplyText({ ...replyText, [queryId]: "" })
    alert("Reply sent to student!")
  }

  const handlePostCourse = (e: React.FormEvent) => {
    e.preventDefault()
    if (!courseTitle || !courseDescription || !courseDuration || !courseStartDate) {
      alert("Please fill in all fields")
      return
    }

    const newCourse = {
      id: postedCourses.length + 1,
      title: courseTitle,
      description: courseDescription,
      category: courseCategory,
      level: courseLevel as "Beginner" | "Intermediate" | "Advanced",
      duration: courseDuration,
      startDate: courseStartDate,
      instructor: "Prof. Your Name",
      enrolledCount: 0,
      rating: 0,
    }

    setPostedCourses([...postedCourses, newCourse])
    setCourseTitle("")
    setCourseDescription("")
    setCourseCategory("Web Development")
    setCourseLevel("Beginner")
    setCourseDuration("")
    setCourseStartDate("")
    setShowCourseForm(false)
    alert("Course posted successfully!")
  }

  const uniqueFields = ["all", ...new Set(alumniData.map((a) => a.field))]

  const filteredAlumni = alumniData.filter((alumni) => {
    const matchesSearch =
      alumni.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      alumni.profession.toLowerCase().includes(searchTerm.toLowerCase()) ||
      alumni.company.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesField = selectedField === "all" || alumni.field === selectedField
    return matchesSearch && matchesField
  })

  return (
    <div className="min-h-screen bg-background">
      <Navbar userType="teacher" currentPage="dashboard" />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Teacher Dashboard</h1>
          <p className="text-muted-foreground">Manage events, handle queries, and connect with alumni</p>
        </div>

        {/* Tabs */}
        <div className="flex gap-4 mb-8 border-b border-border overflow-x-auto">
          {(["overview", "post-event", "post-course", "queries", "alumni", "reviews"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-3 font-medium border-b-2 transition-colors whitespace-nowrap ${
                activeTab === tab
                  ? "border-blue-600 text-blue-600"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              {tab === "post-event"
                ? "Post Event"
                : tab === "post-course"
                  ? "Post Course"
                  : tab === "reviews"
                    ? "Reviews Received"
                    : tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        {/* Overview Tab */}
        {activeTab === "overview" && (
          <div className="space-y-8">
            {/* Stats Cards */}
            <div className="grid md:grid-cols-4 gap-6">
              <div className="bg-card border border-border rounded-lg p-6">
                <div className="text-3xl font-bold text-blue-600 mb-2">{postedEvents.length}</div>
                <p className="text-muted-foreground">Total Events Posted</p>
              </div>
              <div className="bg-card border border-border rounded-lg p-6">
                <div className="text-3xl font-bold text-green-600 mb-2">{Math.floor(Math.random() * 150) + 50}</div>
                <p className="text-muted-foreground">Total Attendees</p>
              </div>
              <div className="bg-card border border-border rounded-lg p-6">
                <div className="text-3xl font-bold text-purple-600 mb-2">
                  {queries.filter((q) => !q.replied).length}
                </div>
                <p className="text-muted-foreground">Pending Queries</p>
              </div>
              <div className="bg-card border border-border rounded-lg p-6">
                <div className="text-3xl font-bold text-orange-600 mb-2">{queries.filter((q) => q.replied).length}</div>
                <p className="text-muted-foreground">Replied Queries</p>
              </div>
            </div>

            {/* Posted Events */}
            <div>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-foreground">Your Posted Events</h2>
                <Button
                  onClick={() => {
                    setActiveTab("post-event")
                    setShowForm(true)
                  }}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  + Post New Event
                </Button>
              </div>

              {postedEvents.length === 0 ? (
                <div className="text-center py-12 bg-card border border-border rounded-lg">
                  <p className="text-muted-foreground mb-4">No events posted yet</p>
                  <Button
                    onClick={() => {
                      setActiveTab("post-event")
                      setShowForm(true)
                    }}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    Post Your First Event
                  </Button>
                </div>
              ) : (
                <div className="grid md:grid-cols-2 gap-6">
                  {postedEvents.map((event) => (
                    <div
                      key={event.id}
                      className="bg-card border border-border rounded-lg p-6 hover:border-blue-500 transition-colors"
                    >
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <div className="text-sm font-medium text-blue-600 mb-1">{event.category}</div>
                          <h3 className="text-lg font-semibold text-foreground">{event.title}</h3>
                        </div>
                        <button
                          onClick={() => handleDeleteEvent(event.id)}
                          className="text-red-600 hover:text-red-700 font-medium text-sm"
                        >
                          Delete
                        </button>
                      </div>

                      <p className="text-muted-foreground text-sm mb-4">{event.description}</p>

                      <div className="space-y-2 text-sm text-muted-foreground mb-4">
                        <div className="flex items-center gap-2">
                          <span>📅</span>
                          <span>{event.date}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span>🕐</span>
                          <span>{event.time}</span>
                        </div>
                      </div>

                      <Button className="w-full bg-blue-100 text-blue-600 hover:bg-blue-200">View Details</Button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Posted Courses */}
            {postedCourses.length > 0 && (
              <div className="mt-12">
                <h3 className="text-xl font-bold text-foreground mb-6">Your Posted Courses</h3>
                <div className="space-y-4">
                  {postedCourses.map((course) => (
                    <div key={course.id} className="bg-card border border-border rounded-lg p-6">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h4 className="font-semibold text-foreground">{course.title}</h4>
                          <p className="text-sm text-muted-foreground">
                            {course.category} • {course.level}
                          </p>
                        </div>
                        <button
                          onClick={() => setPostedCourses(postedCourses.filter((c) => c.id !== course.id))}
                          className="text-destructive hover:text-destructive/80 font-medium"
                        >
                          Delete
                        </button>
                      </div>
                      <p className="text-sm text-muted-foreground mb-3">{course.description}</p>
                      <div className="flex gap-4 text-xs text-muted-foreground">
                        <span>Duration: {course.duration}</span>
                        <span>Starts: {course.startDate}</span>
                        <span>Enrolled: {course.enrolledCount}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Post Event Tab */}
        {activeTab === "post-event" && (
          <div>
            <h2 className="text-2xl font-bold text-foreground mb-6">Post a New Event</h2>

            <div className="max-w-2xl bg-card border border-border rounded-lg p-8">
              <form onSubmit={handlePostEvent} className="space-y-6">
                {/* Event Title */}
                <div>
                  <label htmlFor="title" className="block text-sm font-medium text-foreground mb-2">
                    Event Title
                  </label>
                  <input
                    id="title"
                    type="text"
                    value={eventTitle}
                    onChange={(e) => setEventTitle(e.target.value)}
                    placeholder="e.g., Advanced Web Development Workshop"
                    className="w-full px-4 py-2 rounded-lg border border-border bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-blue-600"
                  />
                </div>

                {/* Event Description */}
                <div>
                  <label htmlFor="description" className="block text-sm font-medium text-foreground mb-2">
                    Event Description
                  </label>
                  <textarea
                    id="description"
                    value={eventDescription}
                    onChange={(e) => setEventDescription(e.target.value)}
                    placeholder="Describe the event in detail..."
                    rows={4}
                    className="w-full px-4 py-2 rounded-lg border border-border bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-blue-600"
                  />
                </div>

                {/* Event Date */}
                <div>
                  <label htmlFor="date" className="block text-sm font-medium text-foreground mb-2">
                    Event Date
                  </label>
                  <input
                    id="date"
                    type="text"
                    value={eventDate}
                    onChange={(e) => setEventDate(e.target.value)}
                    placeholder="e.g., Jan 15, 2025"
                    className="w-full px-4 py-2 rounded-lg border border-border bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-blue-600"
                  />
                </div>

                {/* Event Time */}
                <div>
                  <label htmlFor="time" className="block text-sm font-medium text-foreground mb-2">
                    Event Time
                  </label>
                  <input
                    id="time"
                    type="text"
                    value={eventTime}
                    onChange={(e) => setEventTime(e.target.value)}
                    placeholder="e.g., 3:00 PM"
                    className="w-full px-4 py-2 rounded-lg border border-border bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-blue-600"
                  />
                </div>

                {/* Event Category */}
                <div>
                  <label htmlFor="category" className="block text-sm font-medium text-foreground mb-2">
                    Event Category
                  </label>
                  <select
                    id="category"
                    value={eventCategory}
                    onChange={(e) => setEventCategory(e.target.value)}
                    className="w-full px-4 py-2 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-blue-600"
                  >
                    <option>Workshop</option>
                    <option>Tech Talk</option>
                    <option>Seminar</option>
                    <option>Entrepreneurship</option>
                    <option>Networking</option>
                    <option>Career Talk</option>
                  </select>
                </div>

                {/* Submit Button */}
                <div className="flex gap-4 pt-4">
                  <Button type="submit" className="flex-1 bg-blue-600 hover:bg-blue-700 py-2 h-auto text-base">
                    Post Event
                  </Button>
                  <Button
                    type="button"
                    onClick={() => {
                      setEventTitle("")
                      setEventDescription("")
                      setEventDate("")
                      setEventTime("")
                      setEventCategory("Workshop")
                    }}
                    variant="outline"
                    className="flex-1 py-2 h-auto text-base"
                  >
                    Clear
                  </Button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Post Course Tab */}
        {activeTab === "post-course" && (
          <div>
            <h2 className="text-2xl font-bold text-foreground mb-6">Post a New Course</h2>

            <div className="max-w-2xl bg-card border border-border rounded-lg p-8">
              <form onSubmit={handlePostCourse} className="space-y-6">
                {/* Course Title */}
                <div>
                  <label htmlFor="courseTitle" className="block text-sm font-medium text-foreground mb-2">
                    Course Title
                  </label>
                  <input
                    id="courseTitle"
                    type="text"
                    value={courseTitle}
                    onChange={(e) => setCourseTitle(e.target.value)}
                    placeholder="e.g., Advanced React Development"
                    className="w-full px-4 py-2 rounded-lg border border-border bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-blue-600"
                  />
                </div>

                {/* Course Description */}
                <div>
                  <label htmlFor="courseDescription" className="block text-sm font-medium text-foreground mb-2">
                    Course Description
                  </label>
                  <textarea
                    id="courseDescription"
                    value={courseDescription}
                    onChange={(e) => setCourseDescription(e.target.value)}
                    placeholder="Describe your course content and objectives..."
                    rows={4}
                    className="w-full px-4 py-2 rounded-lg border border-border bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-blue-600"
                  />
                </div>

                {/* Category */}
                <div>
                  <label htmlFor="courseCategory" className="block text-sm font-medium text-foreground mb-2">
                    Category
                  </label>
                  <select
                    id="courseCategory"
                    value={courseCategory}
                    onChange={(e) => setCourseCategory(e.target.value)}
                    className="w-full px-4 py-2 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-blue-600"
                  >
                    <option>Web Development</option>
                    <option>Data Science</option>
                    <option>Machine Learning</option>
                    <option>Mobile Development</option>
                    <option>Design</option>
                    <option>DevOps</option>
                  </select>
                </div>

                {/* Level */}
                <div>
                  <label htmlFor="courseLevel" className="block text-sm font-medium text-foreground mb-2">
                    Level
                  </label>
                  <select
                    id="courseLevel"
                    value={courseLevel}
                    onChange={(e) => setCourseLevel(e.target.value)}
                    className="w-full px-4 py-2 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-blue-600"
                  >
                    <option>Beginner</option>
                    <option>Intermediate</option>
                    <option>Advanced</option>
                  </select>
                </div>

                {/* Duration */}
                <div>
                  <label htmlFor="courseDuration" className="block text-sm font-medium text-foreground mb-2">
                    Duration
                  </label>
                  <input
                    id="courseDuration"
                    type="text"
                    value={courseDuration}
                    onChange={(e) => setCourseDuration(e.target.value)}
                    placeholder="e.g., 8 weeks"
                    className="w-full px-4 py-2 rounded-lg border border-border bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-blue-600"
                  />
                </div>

                {/* Start Date */}
                <div>
                  <label htmlFor="courseStartDate" className="block text-sm font-medium text-foreground mb-2">
                    Start Date
                  </label>
                  <input
                    id="courseStartDate"
                    type="text"
                    value={courseStartDate}
                    onChange={(e) => setCourseStartDate(e.target.value)}
                    placeholder="e.g., Feb 3, 2025"
                    className="w-full px-4 py-2 rounded-lg border border-border bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-blue-600"
                  />
                </div>

                {/* Submit Button */}
                <div className="flex gap-4 pt-4">
                  <button
                    type="submit"
                    className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium transition-colors"
                  >
                    Post Course
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowCourseForm(false)}
                    className="flex-1 px-4 py-2 border border-border rounded-lg hover:bg-muted font-medium transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Student Queries Tab */}
        {activeTab === "queries" && (
          <div>
            <h2 className="text-2xl font-bold text-foreground mb-6">Student Queries</h2>

            {queries.length === 0 ? (
              <div className="text-center py-12 bg-card border border-border rounded-lg">
                <p className="text-muted-foreground">No student queries yet</p>
              </div>
            ) : (
              <div className="space-y-4">
                {queries.map((query) => (
                  <div
                    key={query.id}
                    className="bg-card border border-border rounded-lg p-6 hover:border-blue-500 transition-colors"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="font-semibold text-foreground">{query.studentName}</h3>
                        <p className="text-sm text-muted-foreground">{query.studentEmail}</p>
                      </div>
                      <span
                        className={`text-xs font-medium px-3 py-1 rounded-full ${
                          query.replied ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"
                        }`}
                      >
                        {query.replied ? "✓ Replied" : "⏳ Pending"}
                      </span>
                    </div>

                    <div className="bg-muted/50 p-4 rounded-lg mb-4">
                      <p className="text-foreground text-sm">{query.message}</p>
                      <p className="text-xs text-muted-foreground mt-2">{new Date(query.timestamp).toLocaleString()}</p>
                    </div>

                    {/* Reply Section */}
                    <button
                      onClick={() => setExpandedQuery(expandedQuery === query.id ? null : query.id)}
                      className="text-sm font-medium text-blue-600 hover:underline mb-3"
                    >
                      {expandedQuery === query.id ? "Hide Reply" : "Reply"}
                    </button>

                    {expandedQuery === query.id && (
                      <div className="bg-blue-50 p-4 rounded-lg space-y-3 border border-blue-200">
                        <textarea
                          value={replyText[query.id] || ""}
                          onChange={(e) => setReplyText({ ...replyText, [query.id]: e.target.value })}
                          placeholder="Type your reply here..."
                          rows={3}
                          className="w-full px-3 py-2 rounded-lg border border-border bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-blue-600 text-sm"
                        />
                        <button
                          onClick={() => handleReplyQuery(query.id)}
                          className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium text-sm transition-colors"
                        >
                          Send Reply
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Alumni Network Tab */}
        {activeTab === "alumni" && (
          <div>
            {/* Header */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-foreground mb-4">Alumni Network</h2>
              <p className="text-muted-foreground mb-6">Connect with successful alumni and collaborate on events</p>

              {/* Filters */}
              <div className="space-y-4 mb-8">
                <input
                  type="text"
                  placeholder="Search by name, profession, or company..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full px-4 py-2 rounded-lg border border-border bg-card text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-blue-600"
                />

                <div className="flex gap-2 flex-wrap">
                  {uniqueFields.map((field) => (
                    <button
                      key={field}
                      onClick={() => setSelectedField(field)}
                      className={`px-4 py-2 rounded-lg font-medium transition-colors text-sm ${
                        selectedField === field
                          ? "bg-blue-600 text-white"
                          : "bg-card border border-border text-foreground hover:border-blue-600"
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
                  className="bg-card border border-border rounded-lg p-6 hover:border-blue-600 hover:shadow-lg transition-all flex flex-col text-center"
                >
                  <div className="text-5xl mb-4">{alumni.image}</div>

                  <h3 className="font-semibold text-foreground mb-1 text-balance">{alumni.name}</h3>
                  <p className="text-sm font-medium text-blue-600 mb-2">{alumni.profession}</p>

                  <div className="space-y-2 mb-6 text-xs text-muted-foreground flex-1">
                    <div className="font-medium">{alumni.company}</div>
                    <div>{alumni.field}</div>
                    <div>{alumni.course}</div>
                    <div>Batch {alumni.batch}</div>
                  </div>

                  <div className="space-y-2">
                    <Link href={`/chat/${alumni.id}`} className="block">
                      <Button className="w-full" size="sm">
                        Chat
                      </Button>
                    </Link>
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
          </div>
        )}

        {/* Reviews Tab */}
        {activeTab === "reviews" && (
          <div>
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-foreground mb-2">Reviews & Ratings</h2>
              <p className="text-muted-foreground">Feedback from students about your courses and events</p>
            </div>

            {receivedReviews.length > 0 ? (
              <div className="space-y-4">
                {receivedReviews.map((review) => (
                  <div key={review.id} className="bg-card border border-border rounded-lg p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <h3 className="font-semibold text-foreground mb-1">{review.studentName}</h3>
                        <p className="text-sm text-muted-foreground mb-2">
                          {review.courseTitle ? `Course: ${review.courseTitle}` : `Event: ${review.eventTitle}`}
                        </p>
                        <div className="flex gap-1">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <span
                              key={star}
                              className={`text-lg ${star <= review.rating ? "text-yellow-400" : "text-muted-foreground"}`}
                            >
                              ★
                            </span>
                          ))}
                        </div>
                      </div>
                      <p className="text-xs text-muted-foreground">{review.date}</p>
                    </div>
                    <p className="text-muted-foreground">{review.comment}</p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-card border border-border rounded-lg p-12 text-center">
                <p className="text-muted-foreground">No reviews yet. Keep creating great courses and events!</p>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  )
}
