"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle2, XCircle, AlertCircle, Loader2 } from "lucide-react"
import { auth, db } from "@/lib/firebase"
import { collection, doc, setDoc, getDoc, getDocs, enableNetwork } from "firebase/firestore"

interface TestResult {
  name: string
  status: "pending" | "success" | "error"
  message: string
  details?: any
}

export function FirestoreConnectionTest() {
  const [tests, setTests] = useState<TestResult[]>([])
  const [isRunning, setIsRunning] = useState(false)

  const updateTest = (name: string, status: TestResult["status"], message: string, details?: any) => {
    setTests((prev) => {
      const existing = prev.find((t) => t.name === name)
      if (existing) {
        existing.status = status
        existing.message = message
        existing.details = details
        return [...prev]
      } else {
        return [...prev, { name, status, message, details }]
      }
    })
  }

  const runComprehensiveTest = async () => {
    setIsRunning(true)
    setTests([])

    // Test 1: Check Firebase Config
    updateTest("Firebase Config", "pending", "Checking configuration...")
    try {
      const config = {
        apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY_TEST,
        authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN_TEST,
        projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID_TEST,
      }

      if (!config.apiKey || !config.authDomain || !config.projectId) {
        updateTest("Firebase Config", "error", "Missing environment variables", config)
      } else {
        updateTest("Firebase Config", "success", "Configuration loaded", config)
      }
    } catch (error) {
      updateTest("Firebase Config", "error", `Config error: ${error.message}`)
    }

    // Test 2: Check Auth State
    updateTest("Authentication", "pending", "Checking auth state...")
    try {
      const user = auth.currentUser
      if (!user) {
        updateTest("Authentication", "error", "No user signed in")
        setIsRunning(false)
        return
      } else {
        updateTest("Authentication", "success", `User signed in: ${user.email}`, {
          uid: user.uid,
          email: user.email,
        })
      }
    } catch (error) {
      updateTest("Authentication", "error", `Auth error: ${error.message}`)
      setIsRunning(false)
      return
    }

    // Test 3: Check Firestore Connection
    updateTest("Firestore Connection", "pending", "Testing Firestore connection...")
    try {
      await enableNetwork(db)
      updateTest("Firestore Connection", "success", "Connected to Firestore")
    } catch (error) {
      updateTest("Firestore Connection", "error", `Connection error: ${error.message}`)
    }

    // Test 4: Test Write Operation (Top-level collection)
    updateTest("Write Test (Top-level)", "pending", "Testing write to top-level collection...")
    try {
      const user = auth.currentUser!
      const testDocId = `test_${Date.now()}`
      const testData = {
        title: "Test Event",
        date: new Date().toISOString().split("T")[0],
        completed: false,
        createdAt: new Date(),
        userId: user.uid,
        testType: "top-level",
      }

      await setDoc(doc(db, "events", testDocId), testData)
      updateTest("Write Test (Top-level)", "success", `Document written: ${testDocId}`, testData)

      // Verify the write
      const docSnap = await getDoc(doc(db, "events", testDocId))
      if (docSnap.exists()) {
        updateTest("Read Test (Top-level)", "success", "Document read successfully", docSnap.data())
      } else {
        updateTest("Read Test (Top-level)", "error", "Document not found after write")
      }
    } catch (error) {
      updateTest("Write Test (Top-level)", "error", `Write error: ${error.message}`, error)
    }

    // Test 5: Test Write Operation (Subcollection)
    updateTest("Write Test (Subcollection)", "pending", "Testing write to subcollection...")
    try {
      const user = auth.currentUser!
      const testDocId = `test_${Date.now()}`
      const testData = {
        name: "Test Event Subcollection",
        title: "Test Event Subcollection",
        date: new Date().toISOString().split("T")[0],
        completed: false,
        createdAt: new Date(),
        testType: "subcollection",
      }

      await setDoc(doc(db, "users", user.uid, "calendarEvents", testDocId), testData)
      updateTest("Write Test (Subcollection)", "success", `Document written: ${testDocId}`, testData)

      // Verify the write
      const docSnap = await getDoc(doc(db, "users", user.uid, "calendarEvents", testDocId))
      if (docSnap.exists()) {
        updateTest("Read Test (Subcollection)", "success", "Document read successfully", docSnap.data())
      } else {
        updateTest("Read Test (Subcollection)", "error", "Document not found after write")
      }
    } catch (error) {
      updateTest("Write Test (Subcollection)", "error", `Write error: ${error.message}`, error)
    }

    // Test 6: List all documents in user's subcollection
    updateTest("List Documents", "pending", "Listing all documents in user subcollection...")
    try {
      const user = auth.currentUser!
      const querySnapshot = await getDocs(collection(db, "users", user.uid, "calendarEvents"))
      const docs = []
      querySnapshot.forEach((doc) => {
        docs.push({ id: doc.id, data: doc.data() })
      })
      updateTest("List Documents", "success", `Found ${docs.length} documents`, docs)
    } catch (error) {
      updateTest("List Documents", "error", `List error: ${error.message}`, error)
    }

    // Test 7: Check if using emulator
    updateTest("Environment Check", "pending", "Checking environment...")
    try {
      const isEmulator = window.location.hostname === "localhost"
      const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID_TEST
      updateTest("Environment Check", "success", `Environment: ${isEmulator ? "Local" : "Production"}`, {
        hostname: window.location.hostname,
        projectId: projectId,
        isEmulator: isEmulator,
      })
    } catch (error) {
      updateTest("Environment Check", "error", `Environment error: ${error.message}`)
    }

    setIsRunning(false)
  }

  const getStatusIcon = (status: TestResult["status"]) => {
    switch (status) {
      case "pending":
        return <Loader2 className="h-4 w-4 animate-spin text-blue-500" />
      case "success":
        return <CheckCircle2 className="h-4 w-4 text-green-500" />
      case "error":
        return <XCircle className="h-4 w-4 text-red-500" />
    }
  }

  return (
    <Card className="w-full max-w-4xl">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <AlertCircle className="h-5 w-5" />
          Firestore Connection Diagnostic
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Button onClick={runComprehensiveTest} disabled={isRunning} className="w-full">
          {isRunning ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
              Running Tests...
            </>
          ) : (
            "Run Comprehensive Test"
          )}
        </Button>

        {tests.length > 0 && (
          <div className="space-y-3">
            {tests.map((test, index) => (
              <div key={index} className="border rounded-lg p-3">
                <div className="flex items-center gap-2 mb-2">
                  {getStatusIcon(test.status)}
                  <span className="font-medium">{test.name}</span>
                </div>
                <p className="text-sm text-gray-600 mb-2">{test.message}</p>
                {test.details && (
                  <details className="text-xs">
                    <summary className="cursor-pointer text-blue-600">Show Details</summary>
                    <pre className="mt-2 p-2 bg-gray-100 rounded overflow-auto">
                      {JSON.stringify(test.details, null, 2)}
                    </pre>
                  </details>
                )}
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
