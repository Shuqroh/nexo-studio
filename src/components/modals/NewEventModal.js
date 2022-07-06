import React, { Fragment, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";

export default function NewEventModal({ isOpen, onClosed, addEvent }) {
  const [loading, setLoading] = useState(null);
  const [image, setImage] = useState(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState(1);
  const [quantity, setQuantity] = useState(1);

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog
        as="div"
        className="fixed inset-0 z-10 overflow-y-auto"
        onClose={function () {
          onClosed();
        }}
      >
        <div className="min-h-screen px-4 text-center">
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <Dialog.Overlay className="fixed inset-0 bg-modal" />
          </Transition.Child>

          {/* This element is to trick the browser into centering the modal contents. */}
          <span
            className="inline-block h-screen align-middle"
            aria-hidden="true"
          >
            &#8203;
          </span>

          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0 scale-95"
            enterTo="opacity-100 scale-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100 scale-100"
            leaveTo="opacity-0 scale-95"
          >
            <div className="inline-block w-full md:w-1/3 my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-lg border-2 border-black border-opacity-10">
              <form
                onSubmit={async (e) => {
                  e.preventDefault();
                  if (loading) {
                    return;
                  }
                  setLoading(true);
                  try {
                    let data = {
                      title: title,
                      file: image,
                      description: description,
                      price: price,
                      quantity: quantity,
                    };
                    await addEvent(data);
                    setLoading(false);
                    onClosed();
                  } catch (e) {
                    setLoading(false);
                    console.log(e);
                  }
                }}
              >
                <div className="flex flex-col justify-between">
                  <div className="w-full px-6 md:px-7 py-3 md:py-4 sticky bg-secondary bg-opacity-5 text-center">
                    <h1 className="text-14 md:text-18">New Event</h1>
                  </div>

                  <div className="flex-auto p-6 md:p-7 overflow-y-auto">
                    <div className="mb-4 grid grid-cols-1 md:grid-cols-1 gap-5">
                      <div>
                        <input
                          type="text"
                          name="title"
                          placeholder="Title"
                          onChange={(e) => setTitle(e.target.value)}
                        />
                      </div>
                      <div>
                        <input
                          type="number"
                          name="quantity"
                          placeholder="Quantity"
                          onChange={(e) => setQuantity(e.target.value)}
                        />
                      </div>
                      <div>
                        <input
                          type="number"
                          name="price"
                          placeholder="Price"
                          onChange={(e) => setPrice(e.target.value)}
                        />
                      </div>
                      <div>
                        <input
                          type="file"
                          name="image"
                          onChange={(e) => setImage(e.target.files[0])}
                        />
                      </div>
                      <div>
                        <textarea
                          className="!h-20"
                          name="description"
                          placeholder="Description"
                          onChange={(e) => setDescription(e.target.value)}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="w-full px-6 md:px-7 py-3 md:py-4 sticky bg-secondary bg-opacity-5 flex flex-row justify-between">
                    <button
                      type="button"
                      onClick={function () {
                        onClosed();
                      }}
                      className="bg-white border border-divider shadow-custom-sm hover:bg-grey-header hover:shadow-none disabled:cursor-not-allowed inline-flex text-support disabled:text-grey-divider  py-2 px-2 sm:px-3 text-base sm:text-sm rounded-md font-medium leading-tight outline-none focus:outline-none hover:outline-none transition-all justify-center items-center cursor-pointer box-border flex-shrink-0"
                    >
                      Close
                    </button>
                    <button
                      type="submit"
                      className="bg-white border border-divider shadow-custom-sm hover:bg-grey-header hover:shadow-none disabled:cursor-not-allowed inline-flex text-support disabled:text-grey-divider  py-2 px-2 sm:px-3 text-base sm:text-sm rounded-md font-medium leading-tight outline-none focus:outline-none hover:outline-none transition-all justify-center items-center cursor-pointer box-border flex-shrink-0"
                    >
                      {loading ? "Please wait..." : "Create"}
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition>
  );
}
