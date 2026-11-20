const form = document.querySelector('#business-form');
if (matchMedia('(max-width: 768px)').matches) {
  form.querySelectorAll('fieldset').forEach((field, index) => {
    if (index > 0) {
      field.classList.add('is-collapsed');
      field.querySelector('legend').setAttribute('aria-expanded', 'false');
    }
  });
}
form.querySelectorAll('fieldset legend').forEach((legend) => {
  legend.setAttribute('role','button'); legend.tabIndex=0; legend.setAttribute('aria-expanded','true');
  const toggle=()=>{if(!matchMedia('(max-width: 768px)').matches)return;const field=legend.closest('fieldset');field.classList.toggle('is-collapsed');legend.setAttribute('aria-expanded',String(!field.classList.contains('is-collapsed')))};
  legend.addEventListener('click',toggle); legend.addEventListener('keydown',(event)=>{if(event.key==='Enter'||event.key===' '){event.preventDefault();toggle()}});
});
form.querySelectorAll('textarea[maxlength]').forEach((field)=>field.addEventListener('input',()=>field.parentElement.querySelector('.char-count span').textContent=field.value.length));
form.addEventListener('submit',(event)=>{event.preventDefault();const file=form.querySelector('[name="attachment"]').files[0];const feedback=document.querySelector('#business-feedback');if(file&&file.size>10*1024*1024){feedback.textContent='Please choose a file smaller than 10MB.';feedback.classList.add('is-error');return}feedback.textContent='Thanks for your inquiry. The form is ready, but online submissions are not connected yet. Please email your details to gagandeep.singh@loktara.com.';feedback.classList.remove('is-error')});
