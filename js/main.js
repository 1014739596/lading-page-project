window.dataLayer = window.dataLayer || [];

// Evento 1 y 2: clic en CTA principal y secundario (también funcionan con Click ID en GTM)
['btn-cta-principal','btn-cta-secundario'].forEach(function(id){
  var el = document.getElementById(id);
  if(el) el.addEventListener('click', function(){
    dataLayer.push({event: id === 'btn-cta-principal' ? 'click_cta_principal' : 'click_cta_secundario',
                    cta_text: el.textContent.trim()});
  });
});

// Evento 3: clic en el menú de navegación
document.querySelectorAll('[data-nav]').forEach(function(a){
  a.addEventListener('click', function(){
    dataLayer.push({event:'click_menu', menu_item:a.dataset.nav});
  });
});

// Evento 4: apertura de una pregunta de la FAQ
document.querySelectorAll('details[data-faq]').forEach(function(d){
  d.addEventListener('toggle', function(){
    if(d.open) dataLayer.push({event:'faq_open', faq_item:d.dataset.faq});
  });
});

// Evento 5: envío del formulario de HubSpot
window.addEventListener('message', function(e){
  if(e.data && e.data.type === 'hsFormCallback' && e.data.eventName === 'onFormSubmitted'){
    dataLayer.push({event:'form_submit_hubspot'});
  }
});