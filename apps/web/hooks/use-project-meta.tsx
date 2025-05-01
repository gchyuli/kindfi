import { useEffect, useState } from 'react'
import { supabase } from '~/lib/supabase/config'
import type { Tag, Category } from '~/lib/types'

export function useProjectMeta(projectId: string) {
	const [tags, setTags] = useState<Tag[]>([])
	const [categories, setCategories] = useState<string[]>([])
	const [loading, setLoading] = useState(true)

	useEffect(() => {
		async function fetchMeta() {
			setLoading(true)
			const { data: tagData, error: tagError } = await supabase
				.from('project_tags')
				.select('id, name, color')
				.eq('project_id', projectId)

			const { data: catData, error: catError } = await supabase
				.from('project_categories')
				.select('category_name')
				.eq('project_id', projectId)

			if (!tagError && tagData) {
				const parsedTags: Tag[] = tagData.map((t) => ({
					id: t.id,
					text: t.name,
					color: {
						backgroundColor: t.color?.background || '#E5E7EB',
						textColor: t.color?.text || '#374151',
					},
				}))
				setTags(parsedTags)
			}

			if (!catError && catData) {
				setCategories(catData.map((c) => c.category_name))
			}

			setLoading(false)
		}

		if (projectId) fetchMeta()
	}, [projectId])

	return { tags, categories, loading }
}
