'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

export default function MarketingPage() {
  const [emailCampaign, setEmailCampaign] = useState('')
  const [socialPost, setSocialPost] = useState('')

  const handleEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Logique pour gérer la campagne email
    console.log('Campagne email:', emailCampaign)
  }

  const handleSocialSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Logique pour gérer le post social
    console.log('Post social:', socialPost)
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Gestion Marketing</h1>

      <Tabs defaultValue="email" className="space-y-4">
        <TabsList>
          <TabsTrigger value="email">Campagnes Email</TabsTrigger>
          <TabsTrigger value="social">Médias Sociaux</TabsTrigger>
        </TabsList>

        <TabsContent value="email">
          <Card>
            <CardHeader>
              <CardTitle>Nouvelle Campagne Email</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleEmailSubmit} className="space-y-4">
                <Input
                  placeholder="Titre de la campagne"
                  value={emailCampaign}
                  onChange={(e) => setEmailCampaign(e.target.value)}
                />
                <textarea
                  className="w-full min-h-[200px] p-2 border rounded-md"
                  placeholder="Contenu de l'email"
                />
                <Button type="submit">Lancer la campagne</Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="social">
          <Card>
            <CardHeader>
              <CardTitle>Nouveau Post Social</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSocialSubmit} className="space-y-4">
                <Input
                  placeholder="Titre du post"
                  value={socialPost}
                  onChange={(e) => setSocialPost(e.target.value)}
                />
                <textarea
                  className="w-full min-h-[150px] p-2 border rounded-md"
                  placeholder="Contenu du post"
                />
                <div className="flex gap-2">
                  <Button type="submit">Publier</Button>
                  <Button variant="outline">Programmer</Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
