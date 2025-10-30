'use client'

import React, { useEffect } from "react"
import { useAppDispatch } from "@/redux/store"
import { fetchProjectSuccess } from "@/redux/slices/projects"

type Props = {  
  children: React.ReactNode
  initialProjects: any
}

const ProjectProvider = ({ children, initialProjects }: Props) => {
  const dispatch = useAppDispatch()

  useEffect(() => {
    if (initialProjects?._valueJSON) {
      const projectsData = initialProjects._valueJSON
      dispatch(
        fetchProjectSuccess({
          projects: projectsData,
          total: projectsData.length,
        })
      )
    }
  }, [dispatch, initialProjects])

 
  return <>{children}</>
}

export default ProjectProvider
