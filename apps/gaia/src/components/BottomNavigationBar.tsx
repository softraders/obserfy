import Icon from "$components/Icon/Icon"
import { useQueryString } from "$hooks/useQueryString"
import clsx from "clsx"
import Link from "next/link"
import { useRouter } from "next/router"
import { FC } from "react"

const BottomNavigationBar = () => {
  const studentId = useQueryString("studentId")

  return (
    <nav className="flex sm:hidden fixed right-0 bottom-0 left-0 flex-col justify-end h-24 bg-gradient-to-t from-white via-white pointer-events-none">
      <ul className="flex justify-around items-center h-16 pointer-events-auto">
        <Item href={`/${studentId}`} text="Home" iconSrc="/icons/home.svg" />
        <Item
          href={`/${studentId}/lesson-plan`}
          text="Lessons"
          iconSrc="/icons/book.svg"
        />
        <Item
          href={`/${studentId}/reports`}
          text="Reports"
          iconSrc="/icons/folder.svg"
        />
        <Item
          href={`/${studentId}/assessments`}
          text="Records"
          iconSrc="/icons/archive.svg"
        />
        <Item
          href={`/${studentId}/images`}
          text="Media"
          iconSrc="/icons/camera.svg"
        />
      </ul>
    </nav>
  )
}

const Item: FC<{
  href: string
  text: string
  iconSrc: string
}> = ({ href, text, iconSrc }) => {
  const router = useRouter()
  const isActive = router.asPath === href

  return (
    <li className="flex flex-col flex-grow-0 justify-center w-16 h-16">
      <Link href={href}>
        <a
          className={clsx(
            "flex flex-col items-center text-[11px] font-medium",
            isActive ? "text-green-700" : "opacity-50"
          )}
        >
          <Icon
            src={iconSrc}
            className="!w-6 !h-6"
            color={isActive ? "bg-green-600" : "bg-black"}
          />
          {text}
        </a>
      </Link>
    </li>
  )
}

export default BottomNavigationBar
