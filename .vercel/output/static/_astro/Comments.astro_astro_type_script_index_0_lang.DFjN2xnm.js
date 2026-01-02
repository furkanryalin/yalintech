import{s as c}from"./supabase-client.F75ZvaDp.js";let l=5;document.querySelectorAll(".star-btn").forEach((e,t)=>{e.addEventListener("click",()=>{const n=t+1;l=n;const a=document.getElementById("comment-rating");a&&(a.value=n.toString()),document.querySelectorAll(".star-btn").forEach((r,o)=>{o<n?r.classList.add("active"):r.classList.remove("active")})})});document.querySelectorAll(".star-btn").forEach((e,t)=>{t<5&&e.classList.add("active")});async function m(){const e=document.getElementById("comments-container");if(e)try{const t=await fetch("/api/comments"),n=await t.json();t.ok&&n.comments?p(n.comments):e.innerHTML='<div class="text-center py-8 text-gray-500 dark:text-gray-400">Yorum bulunamadı</div>'}catch(t){console.error("Load comments error:",t),e.innerHTML='<div class="text-center py-8 text-red-500">Yorumlar yüklenemedi</div>'}}function p(e){const t=document.getElementById("comments-container");if(t){if(e.length===0){t.innerHTML='<div class="text-center py-8 text-gray-500 dark:text-gray-400">Henüz yorum yok. İlk yorumu siz bırakın!</div>';return}t.innerHTML=e.map(n=>`
      <div class="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
        <div class="flex items-start justify-between mb-4">
          <div>
            <h4 class="text-lg font-semibold text-gray-900 dark:text-white">${i(n.name)}</h4>
            <p class="text-sm text-gray-500 dark:text-gray-400">${i(n.email)}</p>
          </div>
          <div class="flex items-center gap-2">
            ${n.rating?`
              <div class="flex text-yellow-400">
                ${Array.from({length:n.rating},()=>"★").join("")}
              </div>
            `:""}
            <span class="text-xs text-gray-400 dark:text-gray-500">${new Date(n.created_at).toLocaleDateString("tr-TR")}</span>
          </div>
        </div>
        <p class="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">${i(n.comment)}</p>
      </div>
    `).join("")}}async function u(){try{const{data:{session:e}}=await c.auth.getSession();e?(document.getElementById("comment-form-container")?.classList.remove("hidden"),document.getElementById("login-prompt")?.classList.add("hidden")):(document.getElementById("comment-form-container")?.classList.add("hidden"),document.getElementById("login-prompt")?.classList.remove("hidden"))}catch(e){console.error("Auth check error:",e)}}const s=document.getElementById("comment-form");s?.addEventListener("submit",async e=>{e.preventDefault();const t=new FormData(s),n=t.get("comment"),a=parseInt(t.get("rating")||"5");try{const{data:{session:r}}=await c.auth.getSession();if(!r){alert("Giriş yapmanız gerekiyor"),window.location.href="/login?return="+encodeURIComponent(window.location.pathname);return}const o=await fetch("/api/comments",{method:"POST",headers:{"Content-Type":"application/json",Authorization:`Bearer ${r.access_token}`},body:JSON.stringify({comment:n,rating:a})}),d=await o.json();o.ok&&d.success?(s.reset(),l=5,document.querySelectorAll(".star-btn").forEach((g,y)=>{y<5&&g.classList.add("active")}),m(),alert("Yorumunuz gönderildi! Onaylandıktan sonra görünecek.")):alert(d.error||"Yorum gönderilemedi")}catch(r){console.error("Comment submission error:",r),alert("Bir hata oluştu")}});document.getElementById("login-btn")?.addEventListener("click",()=>{window.location.href="/login?return="+encodeURIComponent(window.location.pathname)});function i(e){const t=document.createElement("div");return t.textContent=e,t.innerHTML}m();u();c.auth.onAuthStateChange((e,t)=>{u()});
