package com.reactnativestripesdk

import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReactApplicationContext
import com.reactnativestripesdk.utils.readableMapOf
import org.junit.Assert.assertEquals
import org.junit.Assert.assertNotNull
import org.junit.Test
import org.junit.runner.RunWith
import org.mockito.Mockito.mock
import org.mockito.Mockito.verify
import org.robolectric.RobolectricTestRunner

@RunWith(RobolectricTestRunner::class)
class CheckoutUnavailableTest {
  @Test
  fun initCheckoutSession_RejectsWithTemporaryError() {
    val context = mock(ReactApplicationContext::class.java)
    val promise = mock(Promise::class.java)
    val module = StripeSdkModule(context)

    module.initCheckoutSession(
      "cs_test_secret_test",
      readableMapOf(),
      promise,
    )

    verify(promise).reject("Failed", CHECKOUT_UNAVAILABLE_MESSAGE)
  }

  @Test
  fun createCheckoutUnavailableError_UsesPaymentSheetErrorShape() {
    val result = createCheckoutUnavailableError()

    val error = result.getMap("error")
    assertNotNull(error)
    assertEquals("Failed", error!!.getString("code"))
    assertEquals(CHECKOUT_UNAVAILABLE_MESSAGE, error.getString("message"))
  }
}
