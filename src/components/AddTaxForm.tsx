import { items } from "../utils/items";
import { useState, useEffect } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";

const AddTaxForm = () => {
  const [categories, setCategories] = useState<any>([]);

  useEffect(() => {
    // Extract categories from items
    const categoryMap = items.reduce((acc: any, item: any) => {
      const category = item.category ? item.category.name : "Uncategorized";
      if (!acc[category]) {
        acc[category] = [];
      }
      acc[category].push(item);
      return acc;
    }, {});
    setCategories(Object.entries(categoryMap));
  }, []);

  return (
    <div className="container w-full m-auto max-w-[800px]">
      <div className="flex flex-col gap-2">
        <h1 className="mt-2 text-2xl font-semibold">Add Tax</h1>
        <Formik
          initialValues={{
            taxName: "",
            taxRate: 0,
            appliedTo: "some",
            applicableItems: [],
          }}
          validationSchema={Yup.object({
            taxName: Yup.string().required("Tax name is required"),
            taxRate: Yup.number()
              .min(0, "Rate must be greater than or equal to 0")
              .required("Rate is required"),
          })}
          // --------------- onSubmit={(values) => console.log(values)}
          onSubmit={(values) => {
            const formData = {
              ...values,
              taxRate: values.taxRate / 100,
            };
            console.log(formData);
          }}
        >
          {({ values, setFieldValue, errors, touched }) => (
            <Form>
              <div className="mt-2 flex gap-2">
                {/*---------------------- Tax Name */}
                <div className="w-[400px]">
                  <Field
                    name="taxName"
                    type="text"
                    placeholder="Name"
                    className={`border border-gray-300 rounded-sm py-1 px-2 w-full ${
                      touched.taxName && errors.taxName ? "border-red-500" : ""
                    }`}
                  />
                  <ErrorMessage name="taxName">
                    {(msg) => <div className="text-red-500 text-sm">{msg}</div>}
                  </ErrorMessage>
                </div>
                {/*---------------------- Tax Rate */}
                <div className="relative w-[120px]">
                  <Field
                    name="taxRate"
                    type="number"
                    placeholder="Rate"
                    className={`border border-gray-300 rounded-sm py-1 px-2 pr-8 w-full ${
                      touched.taxRate && errors.taxRate ? "border-red-500" : ""
                    }`}
                  />
                  <span
                    className={`absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 ${
                      touched.taxRate ? "top-4" : ""
                    }`}
                  >
                    %
                  </span>
                  <ErrorMessage name="taxRate">
                    {(msg) => <div className="text-red-500 text-sm">{msg}</div>}
                  </ErrorMessage>
                </div>
              </div>

              {/* -------------- applied to */}
              <div className="flex flex-col gap-1 border-b-2 border-gray-200 pb-4 mt-4 mb-2">
                <label className="flex gap-2 items-center">
                  <Field name="appliedTo" type="radio" value="all" />
                  Apply to all items in collection
                </label>
                <label className="flex gap-2 items-center">
                  <Field name="appliedTo" type="radio" value="some" />
                  Apply to specific items
                </label>
              </div>

              {values.appliedTo === "some" && (
                <div className="pb-20 mb-4 border-b-2 border-gray-200">
                  {categories.map(([category, items]: any) => (
                    <div key={category} className="w-full flex flex-col">
                      {/* --------- category name */}
                      <label className=" bg-gray-200 p-2 flex gap-2 items-center my-2">
                        <Field
                          type="checkbox"
                          name="category"
                          onChange={() => {
                            const allItemsInCategory = items.map((item: any) => item.id);
                            const allSelected = allItemsInCategory.every((itemId: any) =>
                              values.applicableItems.includes(itemId as never)
                            );

                            const newApplicableItems = allSelected
                              ? values.applicableItems.filter(
                                  (itemId) => !allItemsInCategory.includes(itemId)
                                )
                              : [...new Set([...values.applicableItems, ...allItemsInCategory])];

                            setFieldValue("applicableItems", newApplicableItems);
                          }}
                          checked={items.every((item: any) =>
                            values.applicableItems.includes(item.id as never)
                          )}
                        />
                        {category}
                      </label>
                      {/* --------- applicable items */}
                      <div className="flex-flex-col mx-4">
                        {items.map((item: any) => (
                          <label key={item.id} className="flex gap-2 items-center my-1">
                            <Field
                              type="checkbox"
                              name="applicableItems"
                              value={item.id}
                              checked={values.applicableItems.includes(item.id as never)}
                              onChange={() => {
                                const newApplicableItems = values.applicableItems.includes(
                                  item.id as never
                                )
                                  ? values.applicableItems.filter((itemId) => itemId !== item.id)
                                  : [...values.applicableItems, item.id];

                                setFieldValue("applicableItems", newApplicableItems);
                              }}
                            />
                            {item.name}
                          </label>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/*----------- submit button */}
              <button
                type="submit"
                className="bg-orange-500 border-0 px-4 py-2 cursor-pointer text-white rounded-sm block float-end"
              >
                Apply tax to &nbsp;
                {values.appliedTo === "all"
                  ? "all items"
                  : `${values.applicableItems.length} item(s)`}
              </button>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default AddTaxForm;
