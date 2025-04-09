cfg.aiPromptWelcome=`Velkommen til Min Digitale Venn.<br/><br/>
<i>Her får du vennlig og personlig veiledning om offentlige tjenester. Informasjonen er veiledende – ta kontakt med instansen for detaljerte svar.</i><br/><br/>Hva lurer du på?`;

cfg.aiPrompt= [
  { role: `system`, content:
    `Du er en varm og inkluderende digital assistent som hjelper deg med å forstå og navigere offentlige tjenester. Du gir enkle, personlige svar om alt fra trygd og utdanning til helse og sosiale ytelser.  
Still oppfølgingsspørsmål for å avklare brukerens behov og gi tilpasset veiledning.`
  },
  [`Hva er mine rettigheter ved arbeidsledighet?`, `Du har rett til dagpenger fra NAV. Har du registrert deg som arbeidssøker?`],
  [`Hvordan søker jeg om bostøtte?`, `Bostøtte søkes via din kommune. Vet du hvilken kommune du tilhører?`],
  [`Hva kan jeg få i studiestøtte?`, `Lånekassen tilbyr både lån og stipend. Har du søkt før?`],
  [`Hvordan får jeg tilgang til helsetjenester?`, `Du er automatisk registrert hos en fastlege. Har du en fastlege du kan kontakte?`],
  [`Hvor finner jeg informasjon om trygdeytelser?`, `Informasjon om trygd finnes på NAVs nettside. Har du sjekket der?`]
];

ui.c.ImgA = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAQcAAAC/CAMAAADEm+k5AAAAbFBMVEW6DC8AIFv///8AAVKhqLuyt8a4ACLWhpDRcH+4ACW+ID4AAE8ADVTCyNSEjKThp6/MYXC3AB0XLWT78/QAEVUAGFe2ABjKW2u1AAntyc7UgIt7haBTYISmrb5caInclqDPaXi9FjjCwc6GiqOU7OiQAAAB8ElEQVR4nO3b2UocARRF0bIzGo2tMZ3ZmOH//zGBDdGHEmy4DTZZ67moU+zX4i7LiNPLzZ23Zydrzi/uPbO9mhl+YnSIDtEhOkSH6BAdokN0iA7RITpEh+gQHaJDdIgO0SE6RIfoEB2iQ3SIDtEhOkSH6BAdokN0iA7RITpEh+gQHaJDdIgO0SE6RIfoEB2iQ3SIDtEhOkSH6BAdokN0iA7RITpEh+gQHaJDdIgO0SE65Pg7vBzx4eO+HT7NDE9ZXs3Y7tnh85eh4SHLZt5jOjw1OkSH6BAdokN0iA7RITpEhyzPx918fb/aYfftZn5syvJs3nqGvyEOsDVleeCb/zc6RIfoEB2iQ3SIDtEhOkSH6BAdokN0iA7RITpEh+gQHbKczTt/YGt3gK0py4t5F+shdt8PsDXF/6zoEB2iQ3SIDtEhOkSH6BAdsryecXvvnY+6v/gxNDxkOR1xtf89zszwlKHrpuO/z5qhQ3SIDtEhOkSH6BAdokN0iA7RITpEh+gQHaJDdIgO0SE6RIfoEB2iQ3SIDtEhOkSH6BAdokN0iA7RITpEh+gQHaJDdIgO0SE6RIfoEB2iQ3SIDtEhOkSH6BAdokN0iA7RITpEh+gQHaJDdIgOOf4Ob0b8vNxc//Nr927Nye+7R663Q8NT/gDnPeC7RJa1WQAAAABJRU5ErkJggg=='
cfg.app='Min Digitale Venn';
