'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'

export default function SiteSettingsPage() {
  const [heroTitle, setHeroTitle] = useState('')
  const [heroDescription, setHeroDescription] = useState('')
  const [promotionEnabled, setPromotionEnabled] = useState(false)
  
  const handleHeroSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log('Hero settings updated')
  }

  const handlePromotionsSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log('Promotions updated')
  }

  const handleFeaturedSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log('Featured courses updated')
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Paramètres du Site</h1>

      <Tabs defaultValue="homepage" className="space-y-4">
        <TabsList className="grid grid-cols-4 w-full">
          <TabsTrigger value="homepage">Page d&apos;Accueil</TabsTrigger>
          <TabsTrigger value="hero">Hero Section</TabsTrigger>
          <TabsTrigger value="promotions">Promotions</TabsTrigger>
          <TabsTrigger value="featured">Cours en Vedette</TabsTrigger>
        </TabsList>

        <TabsContent value="homepage">
          <Card>
            <CardHeader>
              <CardTitle>Configuration Page d&apos;Accueil</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Navigation</Label>
                <div className="grid grid-cols-2 gap-4">
                  <Input placeholder="Texte du lien" />
                  <Input placeholder="URL" />
                </div>
                <Button variant="outline" className="w-full">+ Ajouter un lien</Button>
              </div>

              <div className="space-y-2">
                <Label>Sections Visibles</Label>
                <div className="space-y-4">
                  {['Hero', 'Promotions', 'Cours en vedette', 'Témoignages'].map((section) => (
                    <div key={section} className="flex items-center justify-between">
                      <span>{section}</span>
                      <Switch />
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="hero">
          <Card>
            <CardHeader>
              <CardTitle>Configuration Hero</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleHeroSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label>Titre Principal</Label>
                  <Input
                    value={heroTitle}
                    onChange={(e) => setHeroTitle(e.target.value)}
                    placeholder="Titre du hero"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label>Description</Label>
                  <textarea
                    className="w-full min-h-[100px] p-2 border rounded-md"
                    value={heroDescription}
                    onChange={(e) => setHeroDescription(e.target.value)}
                    placeholder="Description du hero"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Image de fond</Label>
                  <Input type="file" accept="image/*" />
                </div>

                <Button type="submit">Sauvegarder</Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="promotions">
          <Card>
            <CardHeader>
              <CardTitle>Gestion des Promotions</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handlePromotionsSubmit} className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Switch
                    checked={promotionEnabled}
                    onCheckedChange={setPromotionEnabled}
                  />
                  <Label>Activer les promotions</Label>
                </div>

                <div className="space-y-2">
                  <Label>Bannière de Promotion</Label>
                  <Input placeholder="Texte de la bannière" />
                </div>

                <div className="space-y-2">
                  <Label>Réduction Globale</Label>
                  <div className="flex gap-4">
                    <Input type="number" placeholder="Pourcentage" />
                    <Input type="date" placeholder="Date de fin" />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Cours en Promotion</Label>
                  <div className="border rounded-md p-4">
                    {/* Liste des cours avec checkbox */}
                    <div className="space-y-2">
                      {['Cours 1', 'Cours 2', 'Cours 3'].map((cours) => (
                        <div key={cours} className="flex items-center gap-2">
                          <input type="checkbox" />
                          <span>{cours}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <Button type="submit">Appliquer les promotions</Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="featured">
          <Card>
            <CardHeader>
              <CardTitle>Cours en Vedette</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleFeaturedSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label>Sélectionner les cours en vedette</Label>
                  <div className="border rounded-md p-4 space-y-2">
                    {['Cours 1', 'Cours 2', 'Cours 3', 'Cours 4'].map((cours) => (
                      <div key={cours} className="flex items-center justify-between p-2 hover:bg-gray-50">
                        <span>{cours}</span>
                        <div className="flex items-center gap-2">
                          <Input type="number" className="w-20" placeholder="Ordre" />
                          <Switch />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Section Titre</Label>
                  <Input placeholder="Titre de la section cours en vedette" />
                </div>

                <div className="space-y-2">
                  <Label>Description</Label>
                  <textarea
                    className="w-full min-h-[100px] p-2 border rounded-md"
                    placeholder="Description de la section"
                  />
                </div>

                <Button type="submit">Sauvegarder</Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
} 
