/* eslint-disable @typescript-eslint/no-unused-vars */
import { v } from "convex/values";
import { mutation, query, QueryCtx } from "./_generated/server";

export const newletters = mutation({
  args: {
    email: v.string(),
  },
  handler: async (ctx, email) => {
    // Rechercher une entrée existante
    const existingNewsletter = await ctx.db
      .query("newletters").first();

    if (existingNewsletter) {
      // si entrée alors on ajoute l'email
      // vérification si l'email existe déjà
      if( await ctx.db.query("newletters").withIndex("by_email", (q) => q.eq("email", [email])).first())
        throw Error("Email déjà inscrit");
      const updated = await ctx.db.patch(existingNewsletter._id, {
        email: [...existingNewsletter.email, email],
      });
      return updated;
    } else {
      // Si aucune entrée n'existe, en créer une nouvelle
      const newLetter = await ctx.db.insert("newletters", {
        email: [email],
      });
      return   newLetter 
    }
  },
}); 

export const websiteRatings = mutation({
  args: {
    rating: v.number(),
    comment: v.string(),
  },
  handler: async (ctx, { rating, comment }) => {
    // Rechercher une entrée existante
    const existingRating = await ctx.db
      .query("homeRating").first();

    if (existingRating) {
      // si entrée alors on ajoute l'email
    
      const updated = await ctx.db.patch(existingRating._id, {
        rating: [...existingRating.rating, rating],
        comment: [...existingRating.comment, comment],
      });
      return updated;
    } else {
      // Si aucune entrée n'existe, en créer une nouvelle
      const newRating = await ctx.db.insert("homeRating", {
        rating: [rating],
        comment: [comment],
      });
      return   newRating 
    }
  },
}); 

export const homeContact = mutation({
  args: {
    fullName: v.string(),
    email: v.string(),
    message: v.string(),
  },
  handler: async (ctx, { fullName, email, message }) => {
    // Rechercher une entrée existante
    const existingContact = await ctx.db
      .query("homeContact").first();

    if (existingContact) {
      // si entrée alors on ajoute les données
      const updated = await ctx.db.patch(existingContact._id, {
        fullName: [...existingContact.fullName, fullName],
        email: [...existingContact.email, email],
        message: [...existingContact.message, message],
      });
      return updated;
    } else {
      // Si aucune entrée n'existe, en créer une nouvelle
      const newContact = await ctx.db.insert("homeContact", {
        fullName: [fullName],
        email: [email],
        message: [message],
      });
      return   newContact 
    }
  },
}); 
