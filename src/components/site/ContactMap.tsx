export function ContactMap({city,address,zip}:{city:string;address:string;zip:string}) {
  return <div className="contact-map">
    <iframe title={`Mappa della sede EOS di ${city}`} src={`https://www.google.com/maps?q=${encodeURIComponent(address+', '+zip+', Italia')}&output=embed`} width="600" height="300" loading="eager" referrerPolicy="no-referrer" allowFullScreen/>
  </div>
}
