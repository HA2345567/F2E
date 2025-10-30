'use client'

import { useProjectCreation } from '@/hooks/use-project'
import { useAppDispatch, useAppSelector } from '@/redux/store'
import { Plus } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import { formatDistanceToNow } from 'date-fns'
import { useQuery } from 'convex/react'
import { api } from '../../../../convex/_generated/api'
import { Id } from '../../../../convex/_generated/dataModel'
import { useEffect } from 'react'
import { fetchProjectSuccess } from '@/redux/slices/projects'

const ProjectList = () => {
  const dispatch = useAppDispatch()
  const user = useAppSelector((state) => state.profile)
  const { projects, canCreate } = useProjectCreation()

  // Fetch projects from Convex
  const fetchedProjects = useQuery(
    api.projects.getUserProjects,
    user?.id ? { userId: user.id as Id<'users'> } : 'skip'
  )

  // Sync fetched projects to Redux
  useEffect(() => {
    if (fetchedProjects) {
      dispatch(fetchProjectSuccess({
        projects: fetchedProjects,
        total: fetchedProjects.length
      }))
    }
  }, [fetchedProjects, dispatch])

  if (!canCreate) {
    return (
      <div className="text-center py-12">
        <p className="text-lg">Please sign in to view your projects</p>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div className='mt-18'>
          <h1 className="text-3xl font-semibold text-foreground">Your Projects</h1>
          <p className="text-muted-foreground mt-2">
            Manage your design projects and continue where you left off
          </p>
        </div>
      </div>

      {projects.length === 0 ? (
        <div className="text-center py-20">
          <div className="w-16 h-16 mx-auto mb-4 rounded-lg bg-muted flex items-center justify-center">
            <Plus className="w-8 h-8 text-muted-foreground mb-2" />
          </div>
          <h3 className="text-lg font-medium text-foreground">No projects yet</h3>
          <p className="text-sm text-muted-foreground mb-6">
            Create your first project to get started
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          {projects.map((project: any) => {
            const projectId = project?._id
            const profileName = user?.name

            // Only build the href if both exist
            const href =
              projectId && profileName
                ? `/dashboard/${profileName}/canvas?project=${projectId}`
                : '#'

            return (
              <Link
                key={project.id || projectId}
                href={href}
                className={`group cursor-pointer ${
                  href === '#' ? 'pointer-events-none opacity-50' : ''
                }`}
              >
                <div className="space-y-2">
                  <div className="aspect-[4/3] rounded-lg overflow-hidden bg-muted">
                    {project.thumbnail ? (
                      <Image
                        src={project.thumbnail}
                        alt={project.name}
                        width={500}
                        height={200}
                        className="w-full h-full object-cover group-hover:scale-105 transition-all duration-200"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                        <Plus className="w-8 h-8 text-gray-400" />
                      </div>
                    )}
                  </div>

                  <div className="font-medium text-foreground text-sm truncate group-hover:text-primary transition-colors">
                    {project.name}
                    <h3 className="text-xs text-muted-foreground">
                      {formatDistanceToNow(new Date(project.lastModified), { addSuffix: true })}
                    </h3>
                  </div>
                </div>
              </Link>
            )
          })}
        </div>
      )}
    </div>
  )
}

export default ProjectList
