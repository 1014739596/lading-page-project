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

// Correo de contacto: se arma con JS para no dejarlo en texto plano en el HTML (privacidad / anti-spam)
document.querySelectorAll('.js-email').forEach(function(a){
  var correo = a.dataset.u + '@' + a.dataset.d;
  a.href = 'mailto:' + correo;
  a.textContent = correo;
});

// Formulario de HubSpot: se carga solo cuando la sección está cerca de verse en pantalla,
// así no pesa en la carga inicial (rendimiento) y no instala cookies de terceros antes de tiempo.
(function(){
  var slot = document.querySelector('.form-slot');
  if(!slot) return;
  var iniciado = false;

  function cargarFormulario(){
    if(iniciado) return;
    iniciado = true;
    var s = document.createElement('script');
    s.src = 'https://js.hsforms.net/forms/embed/v2.js';
    s.charset = 'utf-8';
    s.async = true;
    s.onload = function(){
      if(window.hbspt && window.hbspt.forms){
        window.hbspt.forms.create({
          region: 'na1',
          portalId: '52187491',
          formId: '3ea3eb72-922b-40a3-ba70-2df990be41f1',
          target: '#hs-form',
          onFormReady: function(){
            var cargando = document.getElementById('hs-form-loading');
            if(cargando) cargando.remove();
          }
        });
      }
    };
    s.onerror = function(){
      var cargando = document.getElementById('hs-form-loading');
      if(cargando) cargando.textContent = 'No pudimos cargar el formulario. Recarga la página o escríbenos por correo.';
    };
    document.body.appendChild(s);
  }

  if('IntersectionObserver' in window){
    var io = new IntersectionObserver(function(entradas){
      if(entradas.some(function(e){ return e.isIntersecting; })){
        io.disconnect();
        cargarFormulario();
      }
    }, {rootMargin: '400px 0px'});
    io.observe(slot);
  } else {
    window.addEventListener('load', function(){ setTimeout(cargarFormulario, 2000); });
  }
})();
