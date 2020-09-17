import { useMutation } from "react-query"
import { patchApi } from "../fetchApi"
import { Dayjs } from "../../dayjs"
import { updateObservationCache } from "./useGetObservation"

interface RequestBody {
  longDesc?: string
  shortDesc?: string
  eventTime?: Dayjs
  areaId?: string
  categoryId?: string
}
const usePatchObservation = (observationId: string) => {
  const patchObservation = patchApi<RequestBody>(
    `/observations/${observationId}`
  )
  return useMutation(patchObservation, {
    onSuccess: async (response) => {
      const body = await response.json()
      updateObservationCache(body)
    },
  })
}

export default usePatchObservation
