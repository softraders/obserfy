/** @jsx jsx */
import { FC, Fragment, useState } from "react"
import { Box, Button, Card, Flex, jsx } from "theme-ui"
import { t, Trans } from "@lingui/macro"
import { useLingui } from "@lingui/react"
import { useGetStudent } from "../../api/useGetStudent"
import { usePatchStudentApi } from "../../api/students/usePatchStudentApi"
import Typography from "../Typography/Typography"
import {
  EDIT_GUARDIANS_URL,
  EDIT_STUDENT_CLASS_URL,
  STUDENT_OVERVIEW_PAGE_URL,
  STUDENTS_URL,
} from "../../routes"
import dayjs from "../../dayjs"
import { ReactComponent as EditIcon } from "../../icons/edit.svg"
import { ReactComponent as ChevronRight } from "../../icons/next-arrow.svg"
import Icon from "../Icon/Icon"
import Dialog from "../Dialog/Dialog"
import Input from "../Input/Input"
import DialogHeader from "../DialogHeader/DialogHeader"
import { Gender } from "../../api/students/usePostNewStudent"
import Select from "../Select/Select"
import LoadingPlaceholder from "../LoadingPlaceholder/LoadingPlaceholder"
import { Link } from "../Link/Link"
import AlertDialog from "../AlertDialog/AlertDialog"
import DatePickerDialog from "../DatePickerDialog/DatePickerDialog"
import BackButton from "../BackButton/BackButton"
import Breadcrumb from "../Breadcrumb/Breadcrumb"
import BreadcrumbItem from "../Breadcrumb/BreadcrumbItem"
import { borderTop } from "../../border"

interface Props {
  studentId: string
}

export const PageStudentProfile: FC<Props> = ({ studentId }) => {
  const { data, status } = useGetStudent(studentId)

  if (status === "loading") {
    return (
      <Box>
        <LoadingPlaceholder sx={{ width: "100%", height: "10em" }} mb={3} />
        <LoadingPlaceholder sx={{ width: "100%", height: "10em" }} mb={3} />
        <LoadingPlaceholder sx={{ width: "100%", height: "10em" }} mb={3} />
        <LoadingPlaceholder sx={{ width: "100%", height: "10em" }} mb={3} />
      </Box>
    )
  }

  return (
    <Box sx={{ maxWidth: "maxWidth.sm" }} margin="auto" pb={4}>
      <Flex sx={{ height: 48, alignItems: "center" }}>
        <BackButton to={STUDENT_OVERVIEW_PAGE_URL(studentId)} />
        <Breadcrumb>
          <BreadcrumbItem to={STUDENTS_URL}>
            <Trans>Students</Trans>
          </BreadcrumbItem>
          <BreadcrumbItem to={STUDENT_OVERVIEW_PAGE_URL(studentId)}>
            {data?.name.split(" ")[0]}
          </BreadcrumbItem>
          <BreadcrumbItem>
            <Trans>Profile</Trans>
          </BreadcrumbItem>
        </Breadcrumb>
      </Flex>
      <Card sx={{ borderRadius: [0, "default"] }} mb={3}>
        <NameDataBox
          value={data?.name}
          key={`name${data?.name}`}
          studentId={studentId}
        />
        <GenderDataBox
          value={data?.gender}
          key={`gender${data?.gender}`}
          studentId={studentId}
        />
        <StudentIdDataBox
          value={data?.customId}
          key={`id${data?.customId}`}
          studentId={studentId}
        />
        <DateOfBirthDataBox
          value={data?.dateOfBirth}
          key={`dob${data?.dateOfBirth}`}
          studentId={studentId}
        />
        <DateOfEntryDataBox
          value={data?.dateOfEntry}
          key={`doe${data?.dateOfEntry}`}
          studentId={studentId}
        />
        <NotesDataBox
          value={data?.note}
          key={`note${data?.note}`}
          studentId={studentId}
        />
      </Card>
      <Card sx={{ borderRadius: [0, "default"] }} mb={3}>
        <Flex sx={{ alignItems: "flex-start" }}>
          <Box px={3} py={3}>
            <Typography.Body
              sx={{ lineHeight: 1 }}
              mb={2}
              color="textMediumEmphasis"
            >
              <Trans>Classes</Trans>
            </Typography.Body>
            {data?.classes?.length === 0 && (
              <Typography.Body sx={{ lineHeight: 1 }}>
                <Trans>Not Set</Trans>
              </Typography.Body>
            )}
            {data?.classes?.map((currentClass) => (
              <Typography.Body
                sx={{ lineHeight: 1 }}
                key={currentClass.id}
                mt={3}
              >
                {currentClass.name}
              </Typography.Body>
            ))}
          </Box>

          <Link
            to={EDIT_STUDENT_CLASS_URL(studentId)}
            sx={{ ml: "auto", mt: 3, mr: 3 }}
            data-cy="edit-classes"
          >
            <Button variant="outline" ml="auto">
              <Icon as={EditIcon} />
            </Button>
          </Link>
        </Flex>
      </Card>

      <Card sx={{ borderRadius: [0, "default"] }}>
        <Flex sx={{ alignItems: "center" }} p={3}>
          <Typography.H6>
            <Trans>Guardians</Trans>
          </Typography.H6>
          <Link
            to={EDIT_GUARDIANS_URL(studentId)}
            sx={{ ml: "auto" }}
            data-cy="edit-guardians"
          >
            <Button variant="secondary" p={2}>
              <Trans>Add</Trans>
            </Button>
          </Link>
        </Flex>

        {data?.guardians?.length === 0 && (
          <Typography.Body>
            <Trans>Not Set</Trans>
          </Typography.Body>
        )}

        {data?.guardians?.map(({ id, email, name }) => (
          <Flex p={2} key={id} sx={{ ...borderTop, alignItems: "center" }}>
            <Typography.Body
              p={2}
              sx={{
                width: "80%",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              {name}
            </Typography.Body>
            <Typography.Body
              py={1}
              px={2}
              color="textMediumEmphasis"
              backgroundColor={email ? "transparent" : "tintWarning"}
              sx={{
                width: "100%",
                borderRadius: "default",
                fontWeight: email ? "normal" : "bold",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              {email || <Trans>No email set</Trans>}
            </Typography.Body>
            <Icon as={ChevronRight} mx={2} />
          </Flex>
        ))}
      </Card>

      <Box mt={3}>
        <SetStatusDataBox
          studentId={studentId}
          active={data?.active ?? false}
          name={data?.name ?? ""}
        />
      </Box>
    </Box>
  )
}

const NameDataBox: FC<{ value?: string; studentId: string }> = ({
  value,
  studentId,
}) => {
  const [mutate, { status }] = usePatchStudentApi(studentId)
  const [showEditDialog, setShowEditDialog] = useState(false)
  const [name, setName] = useState(value)
  const saveName = async () => {
    await mutate({ name })
    setShowEditDialog(false)
  }
  return (
    <Fragment>
      <DataBox
        label={t`Name`}
        value={value ?? ""}
        onEditClick={() => setShowEditDialog(true)}
      />
      {showEditDialog && (
        <Dialog>
          <DialogHeader
            title={t`Edit Name`}
            onAcceptText={t`Save`}
            onCancel={() => setShowEditDialog(false)}
            onAccept={saveName}
            loading={status === "loading"}
          />
          <Box sx={{ backgroundColor: "background" }} p={3}>
            <Input
              label={t`Name`}
              sx={{ width: "100%" }}
              onChange={(e) => {
                setName(e.target.value)
              }}
              value={name}
            />
          </Box>
        </Dialog>
      )}
    </Fragment>
  )
}

const GenderDataBox: FC<{ value?: number; studentId: string }> = ({
  value,
  studentId,
}) => {
  const [mutate, { status }] = usePatchStudentApi(studentId)
  const [showEditDialog, setShowEditDialog] = useState(false)
  const [gender, setGender] = useState(value)
  const saveGender = async () => {
    await mutate({ gender })
    setShowEditDialog(false)
  }
  const { i18n } = useLingui()
  return (
    <Fragment>
      <DataBox
        label={t`Gender`}
        onEditClick={() => setShowEditDialog(true)}
        value={(() => {
          switch (gender) {
            case 1:
              return t`Male`
            case 2:
              return t`Female`
            default:
              return t`Not Set`
          }
        })()}
      />
      {showEditDialog && (
        <Dialog>
          <DialogHeader
            title={t`Edit Gender`}
            onAcceptText={t`Save`}
            onCancel={() => setShowEditDialog(false)}
            onAccept={saveGender}
            loading={status === "loading"}
          />
          <Box
            sx={{
              backgroundColor: "background",
            }}
            p={3}
          >
            <Select
              label={t`Gender`}
              value={gender}
              onChange={(e) => {
                setGender(parseInt(e.target.value, 10))
              }}
            >
              <option value={Gender.NotSet}>{i18n._(t`Not Set`)}</option>
              <option value={Gender.Male}>{i18n._(t`Male`)}</option>
              <option value={Gender.Female}>{i18n._(t`Female`)}</option>
            </Select>
          </Box>
        </Dialog>
      )}
    </Fragment>
  )
}

const StudentIdDataBox: FC<{ value?: string; studentId: string }> = ({
  value,
  studentId,
}) => {
  const [mutate, { status }] = usePatchStudentApi(studentId)
  const [showEditDialog, setShowEditDialog] = useState(false)
  const [customId, setCustomId] = useState(value)
  const saveCustomId = async () => {
    await mutate({ customId })
    setShowEditDialog(false)
  }
  return (
    <Fragment>
      <DataBox
        label={t`Student ID`}
        value={customId || t`Not Set`}
        onEditClick={() => setShowEditDialog(true)}
      />
      {showEditDialog && (
        <Dialog>
          <DialogHeader
            title={t`Edit Student ID`}
            onAcceptText={t`Save`}
            onCancel={() => setShowEditDialog(false)}
            onAccept={saveCustomId}
            loading={status === "loading"}
          />
          <Box sx={{ backgroundColor: "background" }} p={3}>
            <Input
              label={t`Student ID`}
              sx={{ width: "100%" }}
              value={customId}
              onChange={(e) => {
                setCustomId(e.target.value)
              }}
              placeholder="Type an ID"
            />
          </Box>
        </Dialog>
      )}
    </Fragment>
  )
}

const NotesDataBox: FC<{ value?: string; studentId: string }> = ({
  value,
  studentId,
}) => {
  const [mutate, { status }] = usePatchStudentApi(studentId)
  const [showEditDialog, setShowEditDialog] = useState(false)
  const [note, setNote] = useState(value)
  const saveNote = async () => {
    await mutate({ note })
    setShowEditDialog(false)
  }

  return (
    <Fragment>
      <DataBox
        label={t`Notes`}
        value={note || "-"}
        onEditClick={() => setShowEditDialog(true)}
      />
      {showEditDialog && (
        <Dialog>
          <DialogHeader
            title={t`Edit Notes`}
            onAcceptText={t`Save`}
            onCancel={() => setShowEditDialog(false)}
            onAccept={saveNote}
            loading={status === "loading"}
          />
          <Box sx={{ backgroundColor: "background" }} p={3}>
            <Input
              label={t`Notes`}
              sx={{ width: "100%" }}
              onChange={(e) => setNote(e.target.value)}
              value={note}
            />
          </Box>
        </Dialog>
      )}
    </Fragment>
  )
}

// TODO: The two components below looks similar, consider refactoring
const DateOfBirthDataBox: FC<{ value?: string; studentId: string }> = ({
  value,
  studentId,
}) => {
  const [mutate] = usePatchStudentApi(studentId)
  const [showEditDialog, setShowEditDialog] = useState(false)

  return (
    <Fragment>
      <DataBox
        label="Date of Birth"
        value={value ? dayjs(value).format("D MMMM YYYY") : "N/A"}
        onEditClick={() => setShowEditDialog(true)}
      />
      {showEditDialog && (
        <DatePickerDialog
          defaultDate={dayjs(value)}
          onConfirm={async (date) => {
            await mutate({
              dateOfBirth: date,
            })
            setShowEditDialog(false)
          }}
          onDismiss={() => setShowEditDialog(false)}
        />
      )}
    </Fragment>
  )
}

const DateOfEntryDataBox: FC<{ value?: string; studentId: string }> = ({
  value,
  studentId,
}) => {
  const [mutate] = usePatchStudentApi(studentId)
  const [showEditDialog, setShowEditDialog] = useState(false)

  return (
    <Fragment>
      <DataBox
        label={t`Date of Entry`}
        value={value ? dayjs(value).format("D MMMM YYYY") : "N/A"}
        onEditClick={() => setShowEditDialog(true)}
      />
      {showEditDialog && (
        <DatePickerDialog
          defaultDate={dayjs(value)}
          onConfirm={async (date) => {
            await mutate({
              dateOfEntry: date,
            })
            setShowEditDialog(false)
          }}
          onDismiss={() => setShowEditDialog(false)}
        />
      )}
    </Fragment>
  )
}
const SetStatusDataBox: FC<{
  studentId: string
  active: boolean
  name: string
}> = ({ studentId, active, name }) => {
  const [mutate] = usePatchStudentApi(studentId)
  const [showStatusDialog, setShowStatusDialog] = useState(false)
  const saveStatus = async () => {
    await mutate({ active: !active })
    setShowStatusDialog(false)
  }
  const setActiveText = "Set as active?"
  const setInactiveText = "Set as inactive?"
  return (
    <Card
      p={3}
      sx={{
        borderRadius: [0, "default"],
        display: "flex",
        alignItems: "center",
        backgroundColor: "surface",
      }}
    >
      <Box>
        <Typography.Body
          sx={{
            fontSize: 0,
            lineHeight: 1.4,
          }}
        >
          <Trans>Status</Trans>
        </Typography.Body>
        <Typography.Body sx={{ color: !active ? "warning" : undefined }}>
          <Trans id={active ? "Active" : "Inactive"} />
        </Typography.Body>
      </Box>
      <Button
        variant={active ? "outline" : "primary"}
        ml="auto"
        onClick={() => setShowStatusDialog(true)}
        sx={{ color: active ? "warning" : undefined }}
        data-cy={active ? "inactive-button" : "active-button"}
      >
        <Trans id={active ? setInactiveText : setActiveText} />
      </Button>
      {showStatusDialog && (
        <AlertDialog
          title={active ? setInactiveText : setActiveText}
          negativeText={t`Cancel`}
          positiveText={t`Yes`}
          body={`Are you sure you want to set ${name} as ${
            active ? "inactive" : "active"
          }?`}
          onNegativeClick={() => setShowStatusDialog(false)}
          onPositiveClick={() => saveStatus()}
        />
      )}
    </Card>
  )
}

const DataBox: FC<{
  label: string
  value: string
  onEditClick?: () => void
}> = ({ label, value, onEditClick }) => (
  <Flex px={3} py={3} sx={{ alignItems: "center" }}>
    <Box>
      <Typography.Body
        sx={{ fontSize: 0, lineHeight: 1.4 }}
        mb={1}
        color="textMediumEmphasis"
      >
        <Trans id={label} />
      </Typography.Body>
      <Typography.Body sx={{ lineHeight: 1.6 }}>
        <Trans id={value} />
      </Typography.Body>
    </Box>
    <Button
      variant="outline"
      ml="auto"
      px={2}
      onClick={onEditClick}
      aria-label={`edit-${label.toLowerCase()}`}
    >
      <Icon as={EditIcon} />
    </Button>
  </Flex>
)

export default PageStudentProfile
