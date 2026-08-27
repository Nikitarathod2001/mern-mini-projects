import React from 'react'

const categories = [
  { name: "Study", icon: "📚" },
  { name: "Work", icon: "💼" },
  { name: "Ideas", icon: "💡" },
  { name: "Projects", icon: "💻" },
  { name: "Todo", icon: "✅" },
  { name: "Personal", icon: "🧑" },
  { name: "Important", icon: "⭐" },
  { name: "Other", icon: "📝" },
];

const Sidebar = ({selectedCategory, onCategoryChange}) => {
  return (
    <aside className='hidden w-64 shrink-0 border-r border-gray-200 bg-white md:block'>

      <div className='p-4'>

        {/* Main navigation */}
        <nav className='space-y-1'>

          <button type='button'
            onClick={() => onCategoryChange("All")} 
            className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition ${
              selectedCategory === "All"
              ? "bg-gray-100 text-gray-900"
              : "text-gray-600 hover:bg-gray-50"
            }`}>

            📋
            <span>All Notes</span>

          </button>

          <button type='button'
            onClick={() => onCategoryChange("Pinned")} 
            className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition ${
              selectedCategory === "Pinned"
              ? "bg-gray-100 text-gray-900"
              : "text-gray-600 hover:bg-gray-50"
            }`}>

            📌
            <span>Pinned</span>

          </button>

        </nav>

        {/* Categories */}
        <div className='mt-8'>

          <p className='mb-3 px-3 text-xs font-semibold uppercase tracking-wider text-gray-400'>
            Categories
          </p>

          <nav className='space-y-1'>

            {
              categories.map((category) => (
                <button type='button' 
                  key={category.name}
                  onClick={() => onCategoryChange(category.name)}
                  className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition ${
                    selectedCategory === category.name
                    ? "bg-gray-100 font-medium text-gray-900"
                    : "text-gray-600 hover:bg-gray-50"
                  }`}
                >

                  <span>{category.icon}</span>
                  <span>{category.name}</span>

                </button>
              ))
            }

          </nav>

        </div>

      </div>

    </aside>
  )
}

export default Sidebar
