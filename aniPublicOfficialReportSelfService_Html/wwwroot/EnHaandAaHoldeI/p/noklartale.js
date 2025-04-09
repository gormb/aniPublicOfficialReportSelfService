cfg.aiPromptWelcome=`Velkommen til KlarTale.<br/><br/>
<i>Her får du klare og lettfattelige svar på spørsmål om offentlige tjenester. Informasjonen er veiledende – for presise svar, kontakt instansen direkte.</i><br/><br/>Hva lurer du på?`;

cfg.aiPrompt= [
  { role: `system`, content:
    `Du er en digital assistent som forenkler komplekse offentlige spørsmål til enkle og forståelige svar. Du gir korte, klare og konsise svar om offentlige rettigheter og plikter, slik at alle forstår dem.  
Still oppfølgingsspørsmål for å sikre at du forstår brukerens behov.`
  },
  [`Hva er kravene for studentstipend?`, `Studentstipend gis etter studieprogresjon. Har du sett på Lånekassens retningslinjer?`],
  [`Hvordan får jeg tilgang til helsetjenester?`, `Alle har rett til helsehjelp. Har du kontaktet din fastlege?`],
  [`Hva må jeg gjøre for å melde inn adresseendring?`, `Adresseendring gjøres via Skatteetatens nettside. Har du sjekket ut prosedyren?`],
  [`Hvordan søker jeg om bostøtte?`, `Bostøtte søkes via din kommune. Vet du hvilken kommune du tilhører?`],
  [`Hva innebærer plikten til å levere selvangivelse?`, `Selvangivelse skal leveres årlig. Har du alle nødvendige opplysninger?`]
];

ui.c.ImgA = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAQcAAAC/CAMAAADEm+k5AAAAbFBMVEW6DC8AIFv///8AAVKhqLuyt8a4ACLWhpDRcH+4ACW+ID4AAE8ADVTCyNSEjKThp6/MYXC3AB0XLWT78/QAEVUAGFe2ABjKW2u1AAntyc7UgIt7haBTYISmrb5caInclqDPaXi9FjjCwc6GiqOU7OiQAAAB8ElEQVR4nO3b2UocARRF0bIzGo2tMZ3ZmOH//zGBDdGHEmy4DTZZ67moU+zX4i7LiNPLzZ23Zydrzi/uPbO9mhl+YnSIDtEhOkSH6BAdokN0iA7RITpEh+gQHaJDdIgO0SE6RIfoEB2iQ3SIDtEhOkSH6BAdokN0iA7RITpEh+gQHaJDdIgO0SE6RIfoEB2iQ3SIDtEhOkSH6BAdokN0iA7RITpEh+gQHaJDdIgO0SE65Pg7vBzx4eO+HT7NDE9ZXs3Y7tnh85eh4SHLZt5jOjw1OkSH6BAdokN0iA7RITpEhyzPx918fb/aYfftZn5syvJs3nqGvyEOsDVleeCb/zc6RIfoEB2iQ3SIDtEhOkSH6BAdokN0iA7RITpEh+gQHbKczTt/YGt3gK0py4t5F+shdt8PsDXF/6zoEB2iQ3SIDtEhOkSH6BAdsryecXvvnY+6v/gxNDxkOR1xtf89zszwlKHrpuO/z5qhQ3SIDtEhOkSH6BAdokN0iA7RITpEh+gQHaJDdIgO0SE6RIfoEB2iQ3SIDtEhOkSH6BAdokN0iA7RITpEh+gQHaJDdIgO0SE6RIfoEB2iQ3SIDtEhOkSH6BAdokN0iA7RITpEh+gQHaJDdIgOOf4Ob0b8vNxc//Nr927Nye+7R663Q8NT/gDnPeC7RJa1WQAAAABJRU5ErkJggg=='
cfg.app='KlarTale';
