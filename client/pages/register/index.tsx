import { Editable, EditableInput, EditablePreview } from '@chakra-ui/react'

const Register = () => {
  return (
    // Click the text to edit
    <Editable defaultValue="Take some chakra">
      <EditablePreview />
      <EditableInput />
    </Editable>
  )
}

export default Register
