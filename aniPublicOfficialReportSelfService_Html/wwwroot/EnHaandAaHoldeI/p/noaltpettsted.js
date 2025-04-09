cfg.aiPromptWelcome=`Velkommen til Alt På Ett Sted.<br/><br/>
<i>Her får du en samlet oversikt over dine offentlige data og tjenester. Informasjonen er veiledende – denne assistenten hjelper deg med å holde orden på avtaler og rettigheter.</i><br/><br/>Hva lurer du på?`;

cfg.aiPrompt= [
  { role: `system`, content:
    `Du er en digital assistent som samler all informasjon om offentlige tjenester på ett sted. Du gir en helhetlig oversikt over dine avtaler, rettigheter og plikter slik at du enkelt kan finne relevant informasjon.  
Still oppfølgingsspørsmål for å kartlegge hva brukeren ønsker oversikt over.`
  },
  [`Hvor finner jeg min pensjonsinformasjon?`, `Pensjonsinformasjon finnes på Min Pensjon. Har du BankID for innlogging?`],
  [`Hvordan ser jeg mine trygdeutbetalinger?`, `Du kan sjekke dine utbetalinger via NAV. Har du tidligere logget inn der?`],
  [`Hvor kan jeg finne informasjon om bostøtte?`, `Bostøtteinformasjon finnes på din kommunes nettside. Vet du hvilken kommune du tilhører?`],
  [`Hvordan får jeg oversikt over mine offentlige avtaler?`, `Du kan se dine avtaler i din digitale postkasse. Har du tilgang til Digital Postkasse?`],
  [`Hvordan ser jeg mine utdanningsrettigheter?`, `Utdanningsinformasjon finnes hos Utdanningsdirektoratet. Har du sjekket deres nettside?`]
];
ui.c.ImgA = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAQcAAAC/CAMAAADEm+k5AAAAbFBMVEW6DC8AIFv///8AAVKhqLuyt8a4ACLWhpDRcH+4ACW+ID4AAE8ADVTCyNSEjKThp6/MYXC3AB0XLWT78/QAEVUAGFe2ABjKW2u1AAntyc7UgIt7haBTYISmrb5caInclqDPaXi9FjjCwc6GiqOU7OiQAAAB8ElEQVR4nO3b2UocARRF0bIzGo2tMZ3ZmOH//zGBDdGHEmy4DTZZ67moU+zX4i7LiNPLzZ23Zydrzi/uPbO9mhl+YnSIDtEhOkSH6BAdokN0iA7RITpEh+gQHaJDdIgO0SE6RIfoEB2iQ3SIDtEhOkSH6BAdokN0iA7RITpEh+gQHaJDdIgO0SE6RIfoEB2iQ3SIDtEhOkSH6BAdokN0iA7RITpEh+gQHaJDdIgO0SE65Pg7vBzx4eO+HT7NDE9ZXs3Y7tnh85eh4SHLZt5jOjw1OkSH6BAdokN0iA7RITpEhyzPx918fb/aYfftZn5syvJs3nqGvyEOsDVleeCb/zc6RIfoEB2iQ3SIDtEhOkSH6BAdokN0iA7RITpEh+gQHbKczTt/YGt3gK0py4t5F+shdt8PsDXF/6zoEB2iQ3SIDtEhOkSH6BAdsryecXvvnY+6v/gxNDxkOR1xtf89zszwlKHrpuO/z5qhQ3SIDtEhOkSH6BAdokN0iA7RITpEh+gQHaJDdIgO0SE6RIfoEB2iQ3SIDtEhOkSH6BAdokN0iA7RITpEh+gQHaJDdIgO0SE6RIfoEB2iQ3SIDtEhOkSH6BAdokN0iA7RITpEh+gQHaJDdIgOOf4Ob0b8vNxc//Nr927Nye+7R663Q8NT/gDnPeC7RJa1WQAAAABJRU5ErkJggg=='
cfg.app='Alt På Ett Sted';
