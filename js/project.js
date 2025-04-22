import { supabase } from './supabase.js'

document.addEventListener('DOMContentLoaded', async () => {
  // 1. Pegar o slug da URL
  const urlParams = new URLSearchParams(window.location.search)
  const projectSlug = urlParams.get('slug')
  
  if (!projectSlug) {
    window.location.href = '/'
    return
  }

  // 2. Carregar dados do projeto
  const { data: project, error: projectError } = await supabase
    .from('projects')
    .select('*')
    .eq('slug', projectSlug)
    .single()

  if (projectError || !project) {
    window.location.href = '/'
    return
  }

  // 3. Carregar conteúdo do projeto
  const { data: contents, error: contentsError } = await supabase
    .from('project_content')
    .select('*')
    .eq('project_id', project.id)
    .order('content_order', { ascending: true })

  // 4. Renderizar projeto
  renderProject(project, contents)
})

function renderProject(project, contents) {
  // Configurar a página
  document.title = `${project.title} | Nina Fola`
  
  // Renderizar cabeçalho
  const header = document.createElement('header')
  header.className = 'project-header'
  header.innerHTML = `
    <h1 class="project-title">${project.title}</h1>
    ${project.subtitle ? `<h2 class="project-subtitle">${project.subtitle}</h2>` : ''}
    <div class="project-meta">${formatCategory(project.category)} • ${new Date(project.created_at).getFullYear()}</div>
  `
  
  // Renderizar conteúdo
  const contentContainer = document.createElement('div')
  contentContainer.className = 'project-content'
  
  contents.forEach(item => {
    const block = document.createElement('div')
    block.className = `content-block content-${item.content_type} ${item.extra_classes || ''}`
    
    switch(item.content_type) {
      case 'text':
        block.innerHTML = `<p>${item.content}</p>`
        break
      case 'image':
        block.innerHTML = `
          <img src="${item.content}" alt="${item.caption || 'Imagem do projeto'}" loading="lazy">
          ${item.caption ? `<div class="content-caption">${item.caption}</div>` : ''}
        `
        break
      case 'video':
        block.innerHTML = `
          <div class="video-container">
            <iframe src="${item.content}" frameborder="0" allowfullscreen></iframe>
          </div>
          ${item.caption ? `<div class="content-caption">${item.caption}</div>` : ''}
        `
        break
      case 'quote':
        block.innerHTML = `
          <blockquote>
            <p>${item.content}</p>
            ${item.caption ? `<cite>${item.caption}</cite>` : ''}
          </blockquote>
        `
        break
    }
    
    contentContainer.appendChild(block)
  })
  
  // Montar a página
  const main = document.querySelector('main')
  main.appendChild(header)
  main.appendChild(contentContainer)
}

function formatCategory(category) {
  return {
    'academic': 'Projeto Acadêmico',
    'artistic': 'Projeto Artístico'
  }[category] || category
}