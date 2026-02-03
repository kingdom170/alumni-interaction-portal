"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Navbar } from "@/components/navbar"
import { RatingModal } from "@/components/rating-modal"

interface Course {
  id: number
  title: string
  instructor: string
  description: string
  duration: string
  level: "Beginner" | "Intermediate" | "Advanced"
  enrolledCount: number
  rating: number
  category: string
  startDate: string
  link: string
}

const coursesData: Course[] = [
  {
    id: 1,
    title: "Web Development Fundamentals",
    instructor: "Prof. Sharma",
    description: "Learn the basics of HTML, CSS, and JavaScript to build responsive websites",
    duration: "8 weeks",
    level: "Beginner",
    enrolledCount: 245,
    rating: 4.8,
    category: "Web Development",
    startDate: "Jan 20, 2025",
    link: "https://www.coursera.org/learn/web-development",
  },
  {
    id: 2,
    title: "Advanced React Patterns",
    instructor: "Prof. Kumar",
    description: "Master advanced React concepts including hooks, context, and performance optimization",
    duration: "6 weeks",
    level: "Advanced",
    enrolledCount: 128,
    rating: 4.9,
    category: "Web Development",
    startDate: "Feb 3, 2025",
    link: "https://www.udemy.com/course/react-the-complete-guide-incl-redux/",
  },
  {
    id: 3,
    title: "Python for Data Science",
    instructor: "Prof. Verma",
    description: "Learn Python, NumPy, Pandas, and Matplotlib for data analysis and visualization",
    duration: "10 weeks",
    level: "Intermediate",
    enrolledCount: 312,
    rating: 4.7,
    category: "Data Science",
    startDate: "Jan 27, 2025",
    link: "https://www.edx.org/learn/python",
  },
  {
    id: 4,
    title: "UI/UX Design Principles",
    instructor: "Prof. Singh",
    description: "Understand design thinking, user research, and prototyping for modern products",
    duration: "7 weeks",
    level: "Beginner",
    enrolledCount: 189,
    rating: 4.6,
    category: "Design",
    startDate: "Feb 10, 2025",
    link: "https://www.coursera.org/specializations/ui-ux-design",
  },
  {
    id: 5,
    title: "Machine Learning Fundamentals",
    instructor: "Prof. Patel",
    description: "Introduction to ML algorithms, supervised learning, and model evaluation",
    duration: "12 weeks",
    level: "Intermediate",
    enrolledCount: 198,
    rating: 4.8,
    category: "Machine Learning",
    startDate: "Feb 17, 2025",
    link: "https://www.coursera.org/learn/machine-learning",
  },
  {
    id: 6,
    title: "Mobile App Development with Flutter",
    instructor: "Prof. Gupta",
    description: "Build cross-platform mobile apps using Flutter and Dart",
    duration: "10 weeks",
    level: "Intermediate",
    enrolledCount: 156,
    rating: 4.7,
    category: "Mobile Development",
    startDate: "Mar 3, 2025",
    link: "https://www.udemy.com/course/learn-flutter-dart-to-build-ios-android-apps/",
  },
]

export default function CoursesPage() {
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [selectedLevel, setSelectedLevel] = useState("All")
  const [searchTerm, setSearchTerm] = useState("")
  const [enrolledCourses, setEnrolledCourses] = useState<number[]>([])
  const [ratingModal, setRatingModal] = useState<{
    isOpen: boolean
    courseId: number | null
    courseTitle: string
  }>({ isOpen: false, courseId: null, courseTitle: "" })
  const [ratings, setRatings] = useState<Record<number, { rating: number; comment: string }>>({})

  const categories = ["All", ...new Set(coursesData.map((c) => c.category))]
  const levels = ["All", "Beginner", "Intermediate", "Advanced"]

  const filteredCourses = coursesData.filter((course) => {
    const matchesSearch = course.title.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === "All" || course.category === selectedCategory
    const matchesLevel = selectedLevel === "All" || course.level === selectedLevel
    return matchesSearch && matchesCategory && matchesLevel
  })

  const handleEnroll = (courseId: number, courseLink: string) => {
    window.open(courseLink, "_blank")
    if (!enrolledCourses.includes(courseId)) {
      setEnrolledCourses([...enrolledCourses, courseId])
    }
  }

  const handleRatingSubmit = (rating: number, comment: string) => {
    if (ratingModal.courseId !== null) {
      setRatings({
        ...ratings,
        [ratingModal.courseId]: { rating, comment },
      })
      setRatingModal({ isOpen: false, courseId: null, courseTitle: "" })
      alert("Thank you for your feedback!")
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar userType="user" currentPage="courses" />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Courses</h1>
          <p className="text-muted-foreground">Learn from expert instructors and enhance your skills</p>
        </div>

        {/* Search Bar */}
        <div className="mb-8">
          <input
            type="text"
            placeholder="Search courses..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-3 rounded-lg border border-border bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

        {/* Filters */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          {/* Category Filter */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-3">Category</label>
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${selectedCategory === category
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-muted-foreground hover:bg-muted/80"
                    }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>

          {/* Level Filter */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-3">Level</label>
            <div className="flex flex-wrap gap-2">
              {levels.map((level) => (
                <button
                  key={level}
                  onClick={() => setSelectedLevel(level)}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${selectedLevel === level
                      ? "bg-accent text-accent-foreground"
                      : "bg-muted text-muted-foreground hover:bg-muted/80"
                    }`}
                >
                  {level}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Courses Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCourses.map((course) => (
            <div
              key={course.id}
              className="bg-card border border-border rounded-lg overflow-hidden hover:shadow-lg transition-shadow"
            >
              {/* Course Header */}
              <div className="bg-gradient-to-r from-primary/10 to-accent/10 p-6 border-b border-border">
                <div className="flex items-start justify-between mb-3">
                  <span className="text-xs font-semibold bg-primary/20 text-primary px-2 py-1 rounded">
                    {course.level}
                  </span>
                  <span className="text-sm font-medium text-foreground">⭐ {course.rating}</span>
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-1">{course.title}</h3>
                <p className="text-sm text-muted-foreground">{course.category}</p>
              </div>

              {/* Course Content */}
              <div className="p-6 space-y-4">
                <p className="text-sm text-muted-foreground">{course.description}</p>

                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <span>👨‍🏫</span>
                    <span>{course.instructor}</span>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <span>⏱️</span>
                    <span>{course.duration}</span>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <span>📅</span>
                    <span>Starts {course.startDate}</span>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <span>👥</span>
                    <span>{course.enrolledCount} enrolled</span>
                  </div>
                </div>

                {ratings[course.id] && (
                  <div className="bg-muted/50 p-2 rounded text-xs">
                    <div className="flex gap-1 mb-1">
                      {[...Array(5)].map((_, i) => (
                        <span key={i}>{i < ratings[course.id].rating ? "⭐" : "☆"}</span>
                      ))}
                    </div>
                    Your rating
                  </div>
                )}

                <Button
                  onClick={() => handleEnroll(course.id, course.link)}
                  className="w-full mb-2"
                  variant={enrolledCourses.includes(course.id) ? "default" : "outline"}
                >
                  {enrolledCourses.includes(course.id) ? "✓ Enrolled" : "Enroll Now"}
                </Button>

                <button
                  onClick={() => setRatingModal({ isOpen: true, courseId: course.id, courseTitle: course.title })}
                  className="w-full px-3 py-2 text-sm font-medium rounded-lg border border-border text-foreground hover:bg-muted transition-colors"
                >
                  {ratings[course.id] ? "Update Rating" : "Rate Course"}
                </button>
              </div>
            </div>
          ))}
        </div>

        {filteredCourses.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground text-lg">No courses found matching your filters.</p>
          </div>
        )}

        <RatingModal
          isOpen={ratingModal.isOpen}
          itemName={ratingModal.courseTitle}
          itemType="course"
          onClose={() => setRatingModal({ isOpen: false, courseId: null, courseTitle: "" })}
          onSubmit={handleRatingSubmit}
        />
      </main>
    </div>
  )
}
