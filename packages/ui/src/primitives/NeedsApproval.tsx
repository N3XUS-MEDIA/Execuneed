import * as React from 'react'

/**
 * Gate for any sentence that states a Discovery benefit, premium, or discount.
 *
 * docs/compliance/RULES.md: product benefit copy requires approval from
 * Discovery Marketing Support before it goes on a page. Until an approval
 * reference exists, the claim must not render at all.
 *
 * `approvalRef` is the Marketing Support ticket id. It is the only thing that
 * unlocks the children — a boolean prop would be too easy to flip by accident.
 * The fallback is deliberately generic and makes no product claim.
 */
export function NeedsApproval({
  approvalRef,
  fallback,
  children,
}: {
  approvalRef?: string | null
  fallback?: React.ReactNode
  children: React.ReactNode
}) {
  if (approvalRef && approvalRef.trim().length > 0) {
    return <>{children}</>
  }

  if (fallback) return <>{fallback}</>

  // Nothing renders. An unapproved product claim is worse than a gap.
  return null
}
