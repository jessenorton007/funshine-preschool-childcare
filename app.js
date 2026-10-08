(() => {
  'use strict';
  const menuToggle = document.querySelector('.menu-toggle');
  const mobileMenu = document.querySelector('#mobile-menu');
  function closeMenu() {
    menuToggle.setAttribute('aria-expanded', 'false');
    menuToggle.setAttribute('aria-label', 'Open menu');
    mobileMenu.hidden = true;
  }
  menuToggle.addEventListener('click', () => {
    const open = menuToggle.getAttribute('aria-expanded') !== 'true';
    menuToggle.setAttribute('aria-expanded', String(open));
    menuToggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    mobileMenu.hidden = !open;
  });
  mobileMenu.querySelectorAll('a').forEach(link => link.addEventListener('click', closeMenu));
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && !mobileMenu.hidden) { closeMenu(); menuToggle.focus(); }
  });
  window.matchMedia('(min-width: 701px)').addEventListener('change', event => { if (event.matches) closeMenu(); });

  const topics = {
    art: { title: 'Messy hands. Brilliant ideas.', text: 'Squish, paint, sculpt, and explore. Child-led art and sensory discoveries make space for creativity, new words, and proud little moments.', icon: 'flower', tag: 'CREATE SOMETHING YOU' },
    numbers: { title: 'Little discoveries that add up.', text: 'Sort colors, count treasures, explore letters, and practice writing basics. Hands-on learning helps growing minds make meaningful connections.', icon: 'sparkle', tag: 'ONE LITTLE DISCOVERY AT A TIME' },
    nature: { title: 'Curiosity, naturally.', text: 'Explore life cycles, tend the garden, and watch butterflies grow. Real experiences invite children to ask questions and discover the world around them.', icon: 'sprout', tag: 'LET CURIOSITY GROW' },
    music: { title: 'Find your happy little rhythm.', text: 'Sing, dance, stretch, and move. Music, yoga, and playful movement bring expression, connection, and a little extra joy to the day.', icon: 'sun', tag: 'MOVE TO YOUR OWN BEAT' }
  };
  const tabs = Array.from(document.querySelectorAll('[role="tab"]'));
  const panel = document.querySelector('#discovery-panel');
  function selectTopic(tab) {
    const topic = topics[tab.dataset.topic];
    tabs.forEach(item => { item.setAttribute('aria-selected', String(item === tab)); item.tabIndex = item === tab ? 0 : -1; });
    panel.setAttribute('aria-labelledby', tab.id);
    panel.querySelector('h4').textContent = topic.title;
    panel.querySelector('p').textContent = topic.text;
    panel.querySelector('use').setAttribute('href', '#' + topic.icon);
    panel.querySelector('.discovery-tag').textContent = topic.tag;
  }
  tabs.forEach((tab, index) => {
    tab.addEventListener('click', () => selectTopic(tab));
    tab.addEventListener('keydown', event => {
      let next;
      if (event.key === 'ArrowRight') next = (index + 1) % tabs.length;
      else if (event.key === 'ArrowLeft') next = (index - 1 + tabs.length) % tabs.length;
      else if (event.key === 'Home') next = 0;
      else if (event.key === 'End') next = tabs.length - 1;
      else return;
      event.preventDefault(); selectTopic(tabs[next]); tabs[next].focus();
    });
  });

  const photos = Array.from(document.querySelectorAll('.gallery-item'));
  const dialog = document.querySelector('#photo-dialog');
  let photoIndex = 0;
  function displayPhoto(index) {
    photoIndex = (index + photos.length) % photos.length;
    const source = photos[photoIndex].querySelector('img');
    document.querySelector('#lightbox-image').src = source.src;
    document.querySelector('#lightbox-image').alt = source.alt;
    document.querySelector('#lightbox-caption').textContent = photos[photoIndex].dataset.caption;
    document.querySelector('#photo-count').textContent = `${photoIndex + 1} / ${photos.length}`;
  }
  photos.forEach((photo, index) => photo.addEventListener('click', () => {
    displayPhoto(index); dialog.showModal(); document.body.classList.add('dialog-open');
  }));
  dialog.querySelector('.lightbox-close').addEventListener('click', () => dialog.close());
  dialog.addEventListener('close', () => document.body.classList.remove('dialog-open'));
  dialog.addEventListener('click', event => {
    if (event.target !== dialog) return;
    const bounds = dialog.getBoundingClientRect();
    if (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom) dialog.close();
  });
  document.querySelector('#photo-prev').addEventListener('click', () => displayPhoto(photoIndex - 1));
  document.querySelector('#photo-next').addEventListener('click', () => displayPhoto(photoIndex + 1));
  dialog.addEventListener('keydown', event => {
    if (event.key === 'ArrowRight') { event.preventDefault(); displayPhoto(photoIndex + 1); }
    if (event.key === 'ArrowLeft') { event.preventDefault(); displayPhoto(photoIndex - 1); }
  });

  const form = document.querySelector('#tour-form');
  const program = document.querySelector('#program-interest');
  document.querySelectorAll('[data-interest]').forEach(link => link.addEventListener('click', () => { program.value = link.dataset.interest; }));
  let inquiry = '';
  form.addEventListener('submit', event => {
    event.preventDefault();
    if (!form.reportValidity()) return;
    const name = document.querySelector('#parent-name').value.trim();
    const email = document.querySelector('#parent-email').value.trim();
    const message = document.querySelector('#message').value.trim();
    if (!name) { document.querySelector('#parent-name').setCustomValidity('Please enter your name.'); form.reportValidity(); return; }
    inquiry = `Hello Funshine!\n\nI'd like to learn more about ${program.value.toLowerCase()} and arrange a tour.\n\nMy name: ${name}\nMy email: ${email}\nProgram: ${program.value}${message ? '\n\n' + message : ''}\n\nPlease let me know about current availability, pricing, and possible tour times.\n\nThank you!\n${name}`;
    document.querySelector('#inquiry-preview').value = inquiry;
    document.querySelector('#email-fallback').hidden = false;
    document.querySelector('#copy-status').textContent = '';
    const subject = `Funshine tour inquiry — ${program.value}`;
    const href = 'mailto:funshinechildcareutah@gmail.com?subject=' + encodeURIComponent(subject) + '&body=' + encodeURIComponent(inquiry);
    window.location.href = href;
  });
  document.querySelector('#parent-name').addEventListener('input', event => event.target.setCustomValidity(''));
  document.querySelector('#copy-inquiry').addEventListener('click', async () => {
    const status = document.querySelector('#copy-status');
    try { await navigator.clipboard.writeText(inquiry); status.textContent = 'Copied. Paste into an email to funshinechildcareutah@gmail.com.'; }
    catch { document.querySelector('#inquiry-preview').focus(); document.querySelector('#inquiry-preview').select(); status.textContent = 'Select and copy the inquiry below.'; }
  });
  document.querySelector('#year').textContent = new Date().getFullYear();
})();
