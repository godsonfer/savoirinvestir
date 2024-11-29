'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Label } from '@/components/ui/label'

export default function CreateExerciseDialog() {
  const [open, setOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    difficulty: '',
    content: ''
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const response = await fetch('/api/exercises', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        setOpen(false)
        // TODO: Rafraîchir la liste des exercices
      } else {
        throw new Error('Erreur lors de la création de l&apos;exercice')
      }
    } catch (error) {
      console.error('Erreur:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | string,
    field: string
  ) => {
    const value = typeof e === 'string' ? e : e.target.value
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-primary">
          Créer un exercice
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Créer un nouvel exercice</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="title">Titre</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => handleChange(e, 'title')}
              placeholder="Titre de l&apos;exercice"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleChange(e, 'description')}
              placeholder="Description de l&apos;exercice"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="difficulty">Difficulté</Label>
            <Select
              value={formData.difficulty}
              onValueChange={(value) => handleChange(value, 'difficulty')}
            >
              <SelectTrigger>
                <SelectValue placeholder="Sélectionner la difficulté" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="easy">Facile</SelectItem>
                <SelectItem value="medium">Moyen</SelectItem>
                <SelectItem value="hard">Difficile</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="content">Contenu de l&apos;exercice</Label>
            <Textarea
              id="content"
              value={formData.content}
              onChange={(e) => handleChange(e, 'content')}
              placeholder="Contenu détaillé de l&apos;exercice"
              className="min-h-[200px]"
              required
            />
          </div>

          <div className="flex justify-end space-x-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
            >
              Annuler
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Création...' : 'Créer l&apos;exercice'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
} 
