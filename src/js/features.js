const crollToTop = document.querySelector('.scrollToTop');

window.onscroll = () => {
  if (window.scrollY > 500) {
    crollToTop.classList.remove('isHide');
  } else if (window.scrollY < 500) {
    crollToTop.classList.add('isHide');
  }
  crollToTop.onclick = () => {
    window.scrollTo(0, 0);
  };
};
