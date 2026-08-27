import React from 'react';
import {faBookOpen, faBriefcase, faLightbulb, faLaptopCode, faCircleCheck, faUser, faFolder, faStar, faNotesMedical, faThumbtack} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";

const categories = [
  {
    name: "Study",
    icon: faBookOpen,
    color: "text-blue-500",
  },
  {
    name: "Work",
    icon: faBriefcase,
    color: "text-indigo-500",
  },
  {
    name: "Ideas",
    icon: faLightbulb,
    color: "text-yellow-500",
  },
  {
    name: "Projects",
    icon: faLaptopCode,
    color: "text-purple-500",
  },
  {
    name: "Todo",
    icon: faCircleCheck,
    color: "text-green-500",
  },
  {
    name: "Personal",
    icon: faUser,
    color: "text-pink-500",
  },
  {
    name: "Important",
    icon: faStar,
    color: "text-orange-500",
  },
  {
    name: "Other",
    icon: faFolder,
    color: "text-gray-500",
  },
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

            <span className='w-5 text-gray-900'>
              <FontAwesomeIcon icon={faNotesMedical}/>
            </span>
            <span>All Notes</span>

          </button>

          <button type='button'
            onClick={() => onCategoryChange("Pinned")} 
            className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition ${
              selectedCategory === "Pinned"
              ? "bg-gray-100 text-gray-900"
              : "text-gray-600 hover:bg-gray-50"
            }`}>

            <span className='w-5 text-red-700'>
              <FontAwesomeIcon icon={faThumbtack}/>
            </span>
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

                  <span className={`w-5 ${category.color}`}>
                    <FontAwesomeIcon icon={category.icon}/>
                  </span>
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
