import { Listbox, Transition } from "@headlessui/react"
import clsx from "clsx"
import { FC, Fragment } from "react"
import StudentProfile from "$components/StudentProfile"
import Icon from "$components/Icon/Icon"

interface Student {
  id: string
  name: string
  profilePic: string
  schoolName?: string
}

const StudentSelector: FC<{
  students: Array<Student>
  selectedStudent?: Student
  setSelectedStudent: (student: Student) => void
}> = ({ students, selectedStudent, setSelectedStudent }) => (
  <Listbox value={selectedStudent} onChange={setSelectedStudent}>
    <Listbox.Label className="sr-only">Select Student</Listbox.Label>
    <div className="relative">
      <SelectedStudent student={selectedStudent} />

      <Transition
        as={Fragment}
        leave="transition ease-in duration-100"
        leaveFrom="opacity-100"
        leaveTo="opacity-0"
      >
        <Listbox.Options className="absolute z-10 mt-1 max-h-56 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
          {students.map((student) => (
            <Option key={student.id} {...student} />
          ))}
        </Listbox.Options>
      </Transition>
    </div>
  </Listbox>
)

const SelectedStudent: FC<{ student?: Student }> = ({ student }) => (
  <Listbox.Button className="mr-4 flex cursor-pointer items-center rounded-full p-0.5 text-left focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500 sm:text-sm">
    <StudentProfile
      src={student?.profilePic}
      width={32}
      height={32}
      className="rounded-full"
    />
    <div>
      <p className="ml-3 max-w-[140px] truncate text-sm font-semibold leading-tight text-gray-900 md:max-w-[200px]">
        {student?.name}
      </p>
      <p className="ml-3 max-w-[140px] truncate text-xs leading-tight text-gray-600 sm:hidden md:max-w-[200px]">
        {student?.schoolName}
      </p>
    </div>
    <Icon
      src="/icons/chevron-down.svg"
      className="ml-2 !h-6 !w-6 shrink-0 opacity-70"
    />
  </Listbox.Button>
)

const Option: FC<Student> = (student) => (
  <Listbox.Option
    className={({ active }) =>
      clsx(
        active ? "bg-primary-600 text-white" : "text-gray-900",
        "relative cursor-pointer select-none py-2 pr-9 pl-3"
      )
    }
    value={student}
  >
    {({ selected, active }) => (
      <>
        <div className="flex items-center">
          <StudentProfile
            src={student.profilePic}
            className="rounded-full"
            width={20}
            height={20}
          />
          <span
            className={clsx(
              selected ? "font-semibold" : "font-normal",
              "ml-3 block truncate text-sm"
            )}
          >
            {student.name}
          </span>
        </div>

        {selected ? (
          <span
            className={clsx(
              active ? "text-white" : "text-primary-600",
              "absolute inset-y-0 right-0 flex items-center pr-4"
            )}
          >
            <Icon src="/icons/check.svg" aria-hidden="true" />
          </span>
        ) : null}
      </>
    )}
  </Listbox.Option>
)

export default StudentSelector
