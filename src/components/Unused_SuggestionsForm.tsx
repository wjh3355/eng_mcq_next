// import React from "react";
// import { useFormik } from "formik";
// import Button from "react-bootstrap/button";

// export default function SuggestionsForm() {

//    const formik = useFormik({
//       initialValues: {
//          text: "",
//       },
//       onSubmit: async (values) => {
         
//          alert(JSON.stringify(values));
//       },
//    });

//    return (
//       <form onSubmit={formik.handleSubmit} className="mt-3">
//          <p>If you have any suggestions for this website, please let us know:</p>
//          <textarea
//             id="text"
//             name="text"
//             onChange={formik.handleChange}
//             value={formik.values.text}
//             style={{ resize: "both" }}
//          />
//          <br/>
//          <Button type="submit" variant="primary">Submit</Button>
//       </form>
//    );
// };
