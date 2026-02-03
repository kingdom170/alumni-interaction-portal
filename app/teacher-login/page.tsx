"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { signInWithEmailAndPassword } from "firebase/auth"
import { doc, getDoc } from "firebase/firestore"
import { auth, db } from "@/lib/firebase"

export default function TeacherLoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email || !password) {
      setError("Please fill in all fields")
      return
    }

    const normalizedEmail = email.toLowerCase().trim()

    if (!normalizedEmail.endsWith("@teacher.mes.ac.in")) {
      setError("Please use your official @teacher.mes.ac.in email")
      return
    }

    try {
      const userCredential = await signInWithEmailAndPassword(auth, normalizedEmail, password)
      const user = userCredential.user

      // Verify role in Firestore
      const userDoc = await getDoc(doc(db, "users", user.uid))
      if (userDoc.exists()) {
        const userData = userDoc.data()
        if (userData.role === "teacher") {
          router.push("/teacher-dashboard")
        } else {
          setError(`This account is registered as ${userData.role}. Please login via ${userData.role} login.`)
          await auth.signOut()
        }
      } else {
        setError("User profile not found")
      }
    } catch (err: any) {
      console.error("Login error:", err)
      setError("Invalid email or password")
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center gap-2 mb-4">
            <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold text-xl">
              S
            </div>
            <h1 className="text-2xl font-bold text-foreground">Slumini</h1>
          </div>
          <h2 className="text-3xl font-bold text-foreground mb-2">Teacher Login</h2>
          <p className="text-muted-foreground">Manage events and student interactions</p>
        </div>

        {/* Login Card */}
        <div className="bg-card border border-border rounded-lg p-8 shadow-lg">
          <form onSubmit={handleLogin} className="space-y-6">
            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-foreground mb-2">
                Email Address
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value)
                  setError("")
                }}
                placeholder="teacher@college.edu"
                className="w-full px-4 py-2 rounded-lg border border-border bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Password */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-foreground mb-2">
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value)
                  setError("")
                }}
                placeholder="••••••••"
                className="w-full px-4 py-2 rounded-lg border border-border bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Error Message */}
            {error && (
              <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-600 text-sm">{error}</div>
            )}

            {/* Submit Button */}
            <div className="grid grid-cols-2 gap-4">
              <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 py-2 h-auto text-base">
                Login
              </Button>
              <Button
                type="button"
                onClick={() => router.push("/register?role=teacher")}
                variant="outline"
                className="w-full border-blue-600 text-blue-600 hover:bg-blue-50 py-2 h-auto text-base"
              >
                Sign Up
              </Button>
            </div>
          </form>

          {/* Back Link */}
          <div className="mt-4 text-center">
            <button
              onClick={() => router.push("/")}
              className="text-sm text-muted-foreground hover:text-foreground transition-colors block w-full"
            >
              Back to Login Options
            </button>
          </div>
        </div>

        {/* Features */}
        <div className="mt-8 grid grid-cols-3 gap-4">
          <div className="text-center">
            <div className="text-2xl mb-2">📅</div>
            <p className="text-xs text-muted-foreground">Post Events</p>
          </div>
          <div className="text-center">
            <div className="text-2xl mb-2">👥</div>
            <p className="text-xs text-muted-foreground">Manage Students</p>
          </div>
          <div className="text-center">
            <div className="text-2xl mb-2">📊</div>
            <p className="text-xs text-muted-foreground">Analytics</p>
          </div>
        </div>
      </div>
    </div>
  )
}
