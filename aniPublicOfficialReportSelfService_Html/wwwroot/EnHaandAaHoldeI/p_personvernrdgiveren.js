//cfg.aiPromptWelcomeQuestion=`Hva er velkomstmeldingen?`;
cfg.aiPromptWelcome=`Velkommen til Personvernrådgiveren.<br/><br/>
        <i>Vi prioriterer personvern. Spørsmål lagres ikke hos oss, og all data behandles i samsvar med GDPR. 
        For mer informasjon, se under Sikkerhet >> Personvern.</i><br/><br/>
        Oppsettet for denne chat anvendes også hvis man i sikkerhetsmenyene velger å ha aktiv filtrering for sensitivitet i spørsmå og svar. For å simulere personvernfilteret, anvend:<br>
        <br>
        User: melding<br>
        Agent: melding<br>
        <br>
        Hva lurer du på?`;
cfg.app='Personvernrådgiveren'

cfg.aiPrompt=cfg.aiPromptPV
msgSend('mistrallarge')