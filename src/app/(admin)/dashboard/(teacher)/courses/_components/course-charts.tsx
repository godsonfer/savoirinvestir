/* eslint-disable @typescript-eslint/no-unused-vars */
"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { formatPrice } from "@/lib/format"
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts"

interface CourseChartsProps {
  revenueData: {
    name: string
    revenue: number
  }[]
  enrollmentData: {
    name: string
    students: number
  }[]
  categoryDistribution: {
    name: string
    value: number
  }[]
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8']

export const CourseCharts = ({
  revenueData,
  enrollmentData,
  categoryDistribution,
}: CourseChartsProps) => {
  return (
    <div className="grid gap-4 grid-cols-1 md:grid-cols-2 mt-4">
      {/* Graphique des revenus */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-medium">
            Évolution des revenus
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={revenueData}>
              <defs>
                <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#8884d8" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <XAxis dataKey="name" />
              <YAxis 
                tickFormatter={(value) => formatPrice(value)}
              />
              <CartesianGrid strokeDasharray="3 3" />
              <Tooltip 
                formatter={(value: number) => formatPrice(value)}
                labelFormatter={(label) => `Période: ${label}`}
              />
              <Area
                type="monotone"
                dataKey="revenue"
                stroke="#8884d8"
                fillOpacity={1}
                fill="url(#colorRevenue)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Graphique des inscriptions */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-medium">
            Inscriptions par période
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={enrollmentData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip 
                formatter={(value: number) => `${value} étudiants`}
                labelFormatter={(label) => `Période: ${label}`}
              />
              <Bar dataKey="students" fill="#82ca9d">
                {enrollmentData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

    </div>
  )
} 
