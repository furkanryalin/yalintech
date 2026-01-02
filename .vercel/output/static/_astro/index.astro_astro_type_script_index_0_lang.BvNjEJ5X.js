async function x(){try{(await fetch("/api/messages?limit=1")).ok?(document.getElementById("login-form")?.classList.add("hidden"),document.getElementById("admin-dashboard")?.classList.remove("hidden"),d(),i()):(document.getElementById("login-form")?.classList.remove("hidden"),document.getElementById("admin-dashboard")?.classList.add("hidden"))}catch(e){console.error("Auth check error:",e)}}const u=document.getElementById("admin-login");u?.addEventListener("submit",async e=>{e.preventDefault();const r=new FormData(u).get("password");try{const a=await fetch("/api/admin/login",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({password:r})}),n=await a.json();if(a.ok&&n.success)document.getElementById("login-form")?.classList.add("hidden"),document.getElementById("admin-dashboard")?.classList.remove("hidden"),d(),i();else{const s=document.getElementById("login-error");s&&(s.textContent=n.error||"Giriş başarısız",s.classList.remove("hidden"))}}catch(a){console.error("Login error:",a)}});document.getElementById("logout-btn")?.addEventListener("click",async()=>{await fetch("/api/admin/login",{method:"DELETE"}),document.getElementById("login-form")?.classList.remove("hidden"),document.getElementById("admin-dashboard")?.classList.add("hidden")});let m="all";async function d(e="all"){m=e;const t=document.getElementById("messages-container");if(t){t.innerHTML='<div class="text-center py-12 text-gray-500 dark:text-gray-400"><p>Yükleniyor...</p></div>';try{const a=await fetch(e==="all"?"/api/messages":`/api/messages?read=${e==="read"}`),n=await a.json();a.ok&&n.messages&&(f(n.messages),b(n.messages))}catch(r){console.error("Load messages error:",r),t.innerHTML='<div class="text-center py-12 text-red-500"><p>Mesajlar yüklenemedi</p></div>'}}}function f(e){const t=document.getElementById("messages-container");if(t){if(e.length===0){t.innerHTML='<div class="text-center py-12 text-gray-500 dark:text-gray-400"><p>Mesaj bulunamadı</p></div>';return}t.innerHTML=e.map(r=>`
      <div class="bg-white dark:bg-gray-800 rounded-xl p-6 shadow ${r.read?"":"border-l-4 border-blue-brand"}">
        <div class="flex items-start justify-between mb-4">
          <div>
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white">${o(r.name)}</h3>
            <p class="text-sm text-gray-500 dark:text-gray-400">${o(r.email)}</p>
            <p class="text-xs text-gray-400 dark:text-gray-500 mt-1">${new Date(r.created_at).toLocaleString("tr-TR")}</p>
          </div>
          <div class="flex gap-2">
            ${r.read?"":`
              <button 
                onclick="markAsRead('${r.id}')" 
                class="px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 rounded text-sm font-medium hover:bg-blue-200 dark:hover:bg-blue-800 transition-all"
              >
                Okundu İşaretle
              </button>
            `}
            <button 
              onclick="deleteMessage('${r.id}')" 
              class="px-3 py-1 bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300 rounded text-sm font-medium hover:bg-red-200 dark:hover:bg-red-800 transition-all"
            >
              Sil
            </button>
          </div>
        </div>
        <p class="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">${o(r.message)}</p>
      </div>
    `).join("")}}function b(e){const t=e.length,r=e.filter(c=>!c.read).length,a=e.filter(c=>c.read).length,n=document.getElementById("total-messages"),s=document.getElementById("unread-messages"),y=document.getElementById("read-messages");n&&(n.textContent=t.toString()),s&&(s.textContent=r.toString()),y&&(y.textContent=a.toString())}window.markAsRead=async function(e){try{(await fetch(`/api/messages/${e}`,{method:"PATCH",headers:{"Content-Type":"application/json"},body:JSON.stringify({read:!0})})).ok&&d(m)}catch(t){console.error("Mark as read error:",t)}};window.deleteMessage=async function(e){if(confirm("Bu mesajı silmek istediğinize emin misiniz?"))try{(await fetch(`/api/messages/${e}`,{method:"DELETE"})).ok&&d(m)}catch(t){console.error("Delete error:",t)}};document.querySelectorAll(".filter-btn").forEach(e=>{e.addEventListener("click",()=>{const t=e.getAttribute("data-filter");document.querySelectorAll(".filter-btn").forEach(r=>{r.classList.remove("bg-blue-brand","text-white"),r.classList.add("bg-gray-200","dark:bg-gray-700","text-gray-700","dark:text-gray-300")}),e.classList.add("bg-blue-brand","text-white"),e.classList.remove("bg-gray-200","dark:bg-gray-700","text-gray-700","dark:text-gray-300"),t&&d(t)})});function o(e){const t=document.createElement("div");return t.textContent=e,t.innerHTML}let g="all";async function l(e="all"){g=e;const t=document.getElementById("users-container");if(t){t.innerHTML='<div class="text-center py-12 text-gray-500 dark:text-gray-400"><p>Yükleniyor...</p></div>';try{const r=await fetch("/api/admin/users"),a=await r.json();if(r.ok&&a.users){let n=a.users;e==="pending"?n=a.users.filter(s=>!s.approved):e==="approved"&&(n=a.users.filter(s=>s.approved)),h(n)}}catch(r){console.error("Load users error:",r),t.innerHTML='<div class="text-center py-12 text-red-500"><p>Kullanıcılar yüklenemedi</p></div>'}}}function h(e){const t=document.getElementById("users-container");if(t){if(e.length===0){t.innerHTML='<div class="text-center py-12 text-gray-500 dark:text-gray-400"><p>Kullanıcı bulunamadı</p></div>';return}t.innerHTML=e.map(r=>`
      <div class="bg-white dark:bg-gray-800 rounded-xl p-6 border ${r.approved?"border-gray-200 dark:border-gray-700":"border-yellow-500"}">
        <div class="flex items-start justify-between mb-4">
          <div>
            <h4 class="text-lg font-semibold text-gray-900 dark:text-white">${o(r.full_name||r.email)}</h4>
            <p class="text-sm text-gray-500 dark:text-gray-400">${o(r.email)}</p>
            <p class="text-xs text-gray-400 dark:text-gray-500 mt-1">${new Date(r.created_at).toLocaleString("tr-TR")}</p>
          </div>
          <div class="flex items-center gap-2">
            ${r.approved?"":`
              <button 
                onclick="approveUser('${r.id}')" 
                class="px-3 py-1 bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 rounded text-sm font-medium hover:bg-green-200 dark:hover:bg-green-800 transition-all"
              >
                Onayla
              </button>
            `}
            <button 
              onclick="deleteUser('${r.id}')" 
              class="px-3 py-1 bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300 rounded text-sm font-medium hover:bg-red-200 dark:hover:bg-red-800 transition-all"
            >
              Sil
            </button>
          </div>
        </div>
      </div>
    `).join("")}}window.approveUser=async function(e){try{(await fetch(`/api/admin/users/${e}`,{method:"PATCH",headers:{"Content-Type":"application/json"},body:JSON.stringify({approved:!0})})).ok&&l(g)}catch(t){console.error("Approve user error:",t)}};window.deleteUser=async function(e){if(confirm("Bu kullanıcıyı silmek istediğinize emin misiniz?"))try{(await fetch(`/api/admin/users/${e}`,{method:"DELETE"})).ok&&l(g)}catch(t){console.error("Delete user error:",t)}};let p="all";async function i(e="all"){p=e;const t=document.getElementById("comments-container");if(t){t.innerHTML='<div class="text-center py-12 text-gray-500 dark:text-gray-400"><p>Yükleniyor...</p></div>';try{const r=await fetch("/api/admin/comments"),a=await r.json();if(r.ok&&a.comments){let n=a.comments;e==="pending"?n=a.comments.filter(s=>!s.approved):e==="approved"&&(n=a.comments.filter(s=>s.approved)),v(n)}}catch(r){console.error("Load comments error:",r),t.innerHTML='<div class="text-center py-12 text-red-500"><p>Yorumlar yüklenemedi</p></div>'}}}function v(e){const t=document.getElementById("comments-container");if(t){if(e.length===0){t.innerHTML='<div class="text-center py-12 text-gray-500 dark:text-gray-400"><p>Yorum bulunamadı</p></div>';return}t.innerHTML=e.map(r=>`
      <div class="bg-white dark:bg-gray-800 rounded-xl p-6 border ${r.approved?"border-gray-200 dark:border-gray-700":"border-yellow-500"}">
        <div class="flex items-start justify-between mb-4">
          <div>
            <h4 class="text-lg font-semibold text-gray-900 dark:text-white">${o(r.name)}</h4>
            <p class="text-sm text-gray-500 dark:text-gray-400">${o(r.email)}</p>
            <p class="text-xs text-gray-400 dark:text-gray-500 mt-1">${new Date(r.created_at).toLocaleString("tr-TR")}</p>
          </div>
          <div class="flex items-center gap-2">
            ${r.rating?`
              <div class="flex text-yellow-400">
                ${Array.from({length:r.rating},()=>"★").join("")}
              </div>
            `:""}
            ${r.approved?"":'<span class="px-2 py-1 bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200 rounded text-xs font-medium">Beklemede</span>'}
          </div>
        </div>
        <p class="text-gray-700 dark:text-gray-300 whitespace-pre-wrap mb-4">${o(r.comment)}</p>
        <div class="flex gap-2">
          ${r.approved?"":`
            <button 
              onclick="approveComment('${r.id}')" 
              class="px-3 py-1 bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 rounded text-sm font-medium hover:bg-green-200 dark:hover:bg-green-800 transition-all"
            >
              Onayla
            </button>
          `}
          <button 
            onclick="deleteComment('${r.id}')" 
            class="px-3 py-1 bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300 rounded text-sm font-medium hover:bg-red-200 dark:hover:bg-red-800 transition-all"
          >
            Sil
          </button>
        </div>
      </div>
    `).join("")}}window.approveComment=async function(e){try{(await fetch(`/api/admin/comments/${e}`,{method:"PATCH",headers:{"Content-Type":"application/json"},body:JSON.stringify({approved:!0})})).ok&&i(p)}catch(t){console.error("Approve comment error:",t)}};window.deleteComment=async function(e){if(confirm("Bu yorumu silmek istediğinize emin misiniz?"))try{(await fetch(`/api/admin/comments/${e}`,{method:"DELETE"})).ok&&i(p)}catch(t){console.error("Delete comment error:",t)}};document.querySelectorAll(".users-filter-btn").forEach(e=>{e.addEventListener("click",()=>{const t=e.getAttribute("data-filter");document.querySelectorAll(".users-filter-btn").forEach(r=>{r.classList.remove("bg-blue-brand","text-white"),r.classList.add("bg-gray-200","dark:bg-gray-700","text-gray-700","dark:text-gray-300")}),e.classList.add("bg-blue-brand","text-white"),e.classList.remove("bg-gray-200","dark:bg-gray-700","text-gray-700","dark:text-gray-300"),t&&l(t)})});document.querySelectorAll(".comments-filter-btn").forEach(e=>{e.addEventListener("click",()=>{const t=e.getAttribute("data-filter");document.querySelectorAll(".comments-filter-btn").forEach(r=>{r.classList.remove("bg-blue-brand","text-white"),r.classList.add("bg-gray-200","dark:bg-gray-700","text-gray-700","dark:text-gray-300")}),e.classList.add("bg-blue-brand","text-white"),e.classList.remove("bg-gray-200","dark:bg-gray-700","text-gray-700","dark:text-gray-300"),t&&i(t)})});x().then(()=>{const e=document.getElementById("login-form"),t=document.getElementById("admin-dashboard");e?.classList.contains("hidden")&&t&&!t.classList.contains("hidden")&&(d(),i(),l())});
