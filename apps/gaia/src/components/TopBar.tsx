import { Menu, Transition } from "@headlessui/react"
import { useRouter } from "next/router"
import { FC, Fragment } from "react"
import clsx from "clsx"
import Button from "$components/Button/Button"
import AlertDialog from "$components/AlertDialog"
import useToggle from "$hooks/useToggle"
import Icon from "$components/Icon/Icon"
import StudentSelector from "$components/StudentSelector"
import useGetChild from "$hooks/api/useGetChild"
import useGetChildren from "$hooks/api/useGetChildren"
import useGetUser from "$hooks/api/useGetUser"
import { useQueryString } from "$hooks/useQueryString"

const TopBar = () => {
  const router = useRouter()
  const studentId = useQueryString("studentId")
  const { data: student } = useGetChild(studentId)
  const { data: user } = useGetUser()
  const { data: students } = useGetChildren()

  return (
    <div className="relative z-20 h-16 bg-surface bg-opacity-90 backdrop-blur-lg sm:sticky sm:top-0 sm:border-b">
      <div className="flex h-16 items-center px-4 sm:pl-0">
        <div className="mr-4 hidden w-sidebar shrink-0 border-r px-4 font-bold text-gray-600 sm:block">
          {student?.schoolName}
        </div>

        {students && student && (
          <StudentSelector
            students={students}
            selectedStudent={student}
            setSelectedStudent={(s) => {
              router.push(`/${s.id}`)
            }}
          />
        )}

        <UserOptions name={user?.name} picture={user?.picture} />
      </div>
    </div>
  )
}

const UserOptions: FC<{
  name: string | undefined
  picture: string | undefined
}> = ({ picture, name }) => {
  const logout = useToggle()

  return (
    <>
      <LogoutAlertDialog isOpen={logout.isOn} close={logout.toggle} />
      <Menu as="div" className="relative ml-auto inline-block text-left">
        <Menu.Button className="group flex shrink-0 items-center rounded-full">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={picture} className="h-8 w-8 rounded-full" alt="" />

          <p className="ml-2 hidden text-sm font-semibold text-gray-700 group-hover:text-primary-800 md:block">
            {name}
          </p>

          <Icon
            src="/icons/chevron-down.svg"
            className="hidden !h-6 !w-6 sm:block"
            color="bg-gray-800 group-hover:bg-primary-800"
          />
        </Menu.Button>

        <Transition
          as={Fragment}
          enter="transition ease-out duration-100"
          enterFrom="transform opacity-0 scale-95"
          enterTo="transform opacity-100 scale-100"
          leave="transition ease-in duration-75"
          leaveFrom="transform opacity-100 scale-100"
          leaveTo="transform opacity-0 scale-95"
        >
          <Menu.Items className="absolute right-0 mt-2 w-40 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
            <div className="py-1">
              <Menu.Item>
                {({ active }) => (
                  <button
                    onClick={logout.toggle}
                    className={clsx(
                      active ? "bg-gray-100 text-gray-900" : "text-gray-700",
                      "group flex w-full items-center py-2 px-4 text-left text-sm"
                    )}
                  >
                    <Icon
                      src="/icons/log-out.svg"
                      className="mr-3 !h-4 !w-4"
                      color="bg-gray-700 group-hover:text-primary-700"
                    />
                    Sign out
                  </button>
                )}
              </Menu.Item>
            </div>
          </Menu.Items>
        </Transition>
      </Menu>
    </>
  )
}

const LogoutAlertDialog: FC<{
  isOpen: boolean
  close: () => void
}> = ({ close, isOpen }) => (
  <AlertDialog
    isOpen={isOpen}
    close={close}
    title="Sign Out"
    description="Do you want to sign out from Obserfy?"
    actionButton={
      // eslint-disable-next-line @next/next/no-html-link-for-pages
      <a href="/api/auth/logout">
        <Button className="w-full !bg-red-600 text-base hover:!bg-red-700 focus:!ring-red-500 sm:ml-3 sm:w-auto sm:text-sm">
          Sign Out
        </Button>
      </a>
    }
    icon={
      <div className="mx-auto flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
        <Icon
          src="/icons/log-out.svg"
          className="h-6 w-6"
          color="bg-red-600"
          aria-hidden="true"
        />
      </div>
    }
  />
)

export default TopBar
